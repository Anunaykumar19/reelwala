// Picks the Prisma datasource provider from DATABASE_URL so local dev stays on SQLite
// while Vercel/Postgres builds use the same schema with provider "postgresql".
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL || "";
const isPg = /^postgres(ql)?:\/\//.test(url);
const src = readFileSync("prisma/schema.prisma", "utf8");
const out = isPg ? src.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"') : src;
const schema = isPg ? "prisma/schema.generated.prisma" : "prisma/schema.prisma";
if (isPg) writeFileSync(schema, out);
const cmd = process.argv[2] || "generate";
console.log(`[prisma] ${cmd} using ${isPg ? "postgresql" : "sqlite"} (${schema})`);
execSync(`npx prisma ${cmd} --schema ${schema}`, { stdio: "inherit" });
