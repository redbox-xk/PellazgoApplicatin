import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const giftCardsTable = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  balance: real("balance").notNull(),
  originalAmount: real("original_amount").notNull(),
  status: text("status").notNull().default("active"),
  recipientEmail: text("recipient_email"),
  message: text("message"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGiftCardSchema = createInsertSchema(giftCardsTable).omit({ id: true, createdAt: true });
export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type GiftCard = typeof giftCardsTable.$inferSelect;
