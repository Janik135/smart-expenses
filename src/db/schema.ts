import { char, date, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Every user-owned table gets a userId referencing this table (DECISIONS.md D5).
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    // Integer minor units + ISO 4217 code; never floats (CLAUDE.md).
    amountMinor: integer("amount_minor").notNull(),
    currency: char("currency", { length: 3 }).notNull(),
    spentOn: date("spent_on", { mode: "string" }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("expenses_user_spent_on_idx").on(t.userId, t.spentOn.desc(), t.createdAt.desc())],
);
