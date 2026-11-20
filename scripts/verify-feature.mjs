// The ONLY way a feature becomes "passing" (CLAUDE.md, lecture 08).
// Usage: npm run verify -- F01
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "feature_list.json";
const id = process.argv[2];
const list = JSON.parse(readFileSync(FILE, "utf8"));
const feature = list.features.find((f) => f.id === id);
if (!feature) {
  console.error(`Unknown feature "${id}". Known: ${list.features.map((f) => f.id).join(", ")}`);
  process.exit(2);
}

console.log(`Verifying ${id}: ${feature.behavior}\n$ ${feature.verification}\n`);
let passed = true;
try {
  execSync(feature.verification, { stdio: "inherit", shell: true });
} catch {
  passed = false;
}

const commit = execSync("git rev-parse --short HEAD").toString().trim();
feature.state = passed ? "passing" : "active";
feature.evidence = `${passed ? "PASS" : "FAIL"} ${new Date().toISOString()} at ${commit} (uncommitted changes may apply)`;
writeFileSync(FILE, JSON.stringify(list, null, 2) + "\n");
console.log(`\n${id} -> ${feature.state}`);
process.exit(passed ? 0 : 1);
