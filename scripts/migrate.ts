// Applies Drizzle migrations and seeds the default user. Idempotent.
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { users } from "../src/db/schema";
import { DEFAULT_USER_ID } from "../src/lib/current-user";
import { loadConfig } from "../src/lib/config";

async function main() {
  const pool = new Pool({ connectionString: loadConfig().databaseUrl });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await db.insert(users).values({ id: DEFAULT_USER_ID, displayName: "Me" }).onConflictDoNothing();
  await pool.end();
  console.log("migrations applied, default user present");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
