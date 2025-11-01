import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const platformEnum = pgEnum("platform", ["ios", "android"]);

export const betaSignups = pgTable("beta_signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  platform: platformEnum("platform"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  ipAddress: text("ip_address"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  language: text("language"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BetaSignup = typeof betaSignups.$inferSelect;
export type NewBetaSignup = typeof betaSignups.$inferInsert;
