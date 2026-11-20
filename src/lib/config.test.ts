import { describe, expect, it } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("reads values and defaults the receipts container", () => {
    const config = loadConfig({ DATABASE_URL: "postgres://x", STORAGE_CONNECTION_STRING: "conn" });
    expect(config).toEqual({
      databaseUrl: "postgres://x",
      storageConnectionString: "conn",
      receiptsContainer: "receipts",
    });
  });

  it("names every missing variable and how to fix it", () => {
    expect(() => loadConfig({})).toThrow(/DATABASE_URL, STORAGE_CONNECTION_STRING.*init\.sh/);
  });
});
