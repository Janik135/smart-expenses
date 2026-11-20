import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { loadConfig } from "@/lib/config";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool?: Pool };

function getPool(): Pool {
  globalForDb.pool ??= new Pool({ connectionString: loadConfig().databaseUrl });
  return globalForDb.pool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}
