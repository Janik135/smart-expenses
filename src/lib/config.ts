export type AppConfig = {
  databaseUrl: string;
  storageConnectionString: string;
  receiptsContainer: string;
};

/** Reads config from environment variables and fails fast with an actionable message. */
export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  const missing = ["DATABASE_URL", "STORAGE_CONNECTION_STRING"].filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(", ")}. ` +
        `Run ./init.sh (creates .env from .env.example) or set them in the environment.`,
    );
  }
  return {
    databaseUrl: env.DATABASE_URL!,
    storageConnectionString: env.STORAGE_CONNECTION_STRING!,
    receiptsContainer: env.RECEIPTS_CONTAINER || "receipts",
  };
}
