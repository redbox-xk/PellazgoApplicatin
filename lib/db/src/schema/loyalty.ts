import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loyaltyAccountsTable = pgTable("loyalty_accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("default"),
  points: integer("points").notNull().default(0),
  tier: text("tier").notNull().default("Bronze"),
  lifetimePoints: integer("lifetime_points").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  nextTierPoints: integer("next_tier_points").notNull().default(500),
  badges: text("badges").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLoyaltyAccountSchema = createInsertSchema(loyaltyAccountsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLoyaltyAccount = z.infer<typeof insertLoyaltyAccountSchema>;
export type LoyaltyAccount = typeof loyaltyAccountsTable.$inferSelect;
