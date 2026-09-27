import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const source = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
const statements = source.split(/;\s*(?:\n|$)/).map((statement) => statement.trim()).filter(Boolean);
const sql = neon(process.env.DATABASE_URL);

for (const statement of statements) await sql.query(statement);

const tables = await sql`select table_name from information_schema.tables where table_schema = ${"public"} order by table_name`;
console.log(`Database ready: ${tables.map((row) => row.table_name).join(", ")}`);
