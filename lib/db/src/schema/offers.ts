import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  discount: text("discount").notNull(),
  imageUrl: text("image_url").notNull(),
  businessId: integer("business_id").notNull(),
  businessName: text("business_name"),
  validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offersTable).omit({ id: true, createdAt: true });
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offersTable.$inferSelect;
