import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { getReceiptsContainer } from "@/lib/storage";

export const dynamic = "force-dynamic";

async function check(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
    return "ok";
  } catch (e) {
    return `error: ${e instanceof Error ? e.message : String(e)}`;
  }
}

/** Readiness probe: used by e2e tests now and by Azure Container Apps later. */
export async function GET() {
  const checks = {
    database: await check(() => getDb().execute(sql`select 1`)),
    storage: await check(() => getReceiptsContainer().createIfNotExists()),
  };
  const healthy = Object.values(checks).every((v) => v === "ok");
  return Response.json({ status: healthy ? "ok" : "degraded", checks }, { status: healthy ? 200 : 503 });
}
