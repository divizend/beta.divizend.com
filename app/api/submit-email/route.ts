import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { betaSignups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      token,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      language,
      timezone,
    } = body;

    // Extract tracking data from request
    const userAgent = request.headers.get("user-agent") || null;
    const referrer =
      request.headers.get("referer") || request.headers.get("referrer") || null;
    const ipAddress = getClientIp(request);

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify Turnstile token only if secret key is configured
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (secretKey) {
      // Validate Turnstile token
      if (!token || typeof token !== "string") {
        return NextResponse.json(
          { success: false, message: "Missing Turnstile token" },
          { status: 400 }
        );
      }

      // Verify Turnstile token
      const isValid = await verifyTurnstileToken(token);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Verification failed" },
          { status: 400 }
        );
      }
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db
      .select()
      .from(betaSignups)
      .where(eq(betaSignups.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      // Email already exists, return success (idempotent)
      return NextResponse.json({
        success: true,
        message: "Email already registered",
      });
    }

    // Insert email into database with tracking data
    try {
      await db.insert(betaSignups).values({
        email: normalizedEmail,
        userAgent: userAgent || null,
        referrer: referrer || null,
        ipAddress: ipAddress || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmTerm: utmTerm || null,
        utmContent: utmContent || null,
        language: language || null,
        timezone: timezone || null,
      });
    } catch (dbError) {
      // Handle duplicate email error (in case of race condition)
      const error = dbError as { code?: string; message?: string };
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return NextResponse.json({
          success: true,
          message: "Email already registered",
        });
      }
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: "Email submitted successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
