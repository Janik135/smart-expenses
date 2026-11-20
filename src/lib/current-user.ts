import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";

/** Fixed id of the single default user until real auth exists (DECISIONS.md D5). */
export const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

/**
 * The ONLY place that decides who the current user is.
 * Later: read the Easy Auth headers (x-ms-client-principal) here.
 */
export async function getCurrentUser() {
  const [user] = await getDb().select().from(users).where(eq(users.id, DEFAULT_USER_ID));
  if (!user) {
    throw new Error("Default user not found. Run `npm run db:migrate` (seeds the default user).");
  }
  return user;
}
