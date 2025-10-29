"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

function getUtmParameters(): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
} {
  if (typeof window === "undefined") {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

function getBrowserLanguage(): string | null {
  if (typeof window === "undefined") return null;
  return (
    navigator.language ||
    (navigator as { userLanguage?: string }).userLanguage ||
    null
  );
}

function getTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

export function EmailForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const submitForm = useCallback(async () => {
    // If Turnstile is configured, require token; otherwise allow submission without token
    if (siteKey && !turnstileToken) {
      setStatus("error");
      setPendingSubmission(false);
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setPendingSubmission(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      // Collect tracking data
      const utmParams = getUtmParameters();
      const language = getBrowserLanguage();
      const timezone = getTimezone();

      const response = await fetch("/api/submit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: turnstileToken || null,
          utmSource: utmParams.utmSource,
          utmMedium: utmParams.utmMedium,
          utmCampaign: utmParams.utmCampaign,
          utmTerm: utmParams.utmTerm,
          utmContent: utmParams.utmContent,
          language,
          timezone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
        setTurnstileToken(null);
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        console.error("Submission error:", data);
        setStatus("error");
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
        setTurnstileToken(null);
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken(null);
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, turnstileToken, siteKey]);

  // Auto-submit when token is received and submission is pending
  useEffect(() => {
    if (pendingSubmission && turnstileToken) {
      submitForm();
    }
  }, [turnstileToken, pendingSubmission, submitForm]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // If Turnstile is not configured, submit directly
    if (!siteKey) {
      await submitForm();
      return;
    }

    // If we have a token, submit directly
    if (turnstileToken) {
      await submitForm();
      return;
    }

    // Otherwise, trigger Turnstile execution and wait for token
    if (turnstileRef.current) {
      setPendingSubmission(true);
      turnstileRef.current?.execute();

      // Timeout after 10 seconds
      timeoutRef.current = setTimeout(() => {
        setPendingSubmission((prev) => {
          if (prev && !turnstileToken) {
            return false;
          }
          return prev;
        });
        if (!turnstileToken) {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        }
      }, 10000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-md px-4 sm:px-0"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail für Beta-Anmeldung"
        required
        disabled={isSubmitting}
        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground/60"
      />
      <button
        type="submit"
        disabled={isSubmitting || status === "success"}
        className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium bg-foreground text-background rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap"
      >
        {isSubmitting
          ? "Wird angemeldet..."
          : status === "success"
          ? "Angemeldet"
          : status === "error"
          ? "Fehler"
          : "Für Beta anmelden"}
      </button>
      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => {
            setTurnstileToken(null);
          }}
          onExpire={() => {
            setTurnstileToken(null);
          }}
          options={{
            theme: "auto",
            size: "invisible",
          }}
          ref={turnstileRef}
        />
      )}
    </form>
  );
}
