import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const notesTable = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertNote = typeof notesTable.$inferInsert;
export type SelectNote = typeof notesTable.$inferSelect;