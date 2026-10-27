import { pgTable, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const rsvps = pgTable("rsvps", {
  id: text().primaryKey(),
  name: text().notNull(),
  attending: boolean().notNull(),
  guestCount: integer("guest_count").notNull().default(0),
  selectedEvents: jsonb("selected_events").$type<string[]>().notNull().default([]),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text().primaryKey(),
  value: text().notNull(),
});
