import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Every user-owned table gets a userId referencing this table (DECISIONS.md D5).
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
