import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const forbidden = String.fromCodePoint(8212);
const roots = ["src", "database", "scripts", "legacy-prototype", ".agents", "work/data"];
const files = ["AGENTS.md", "README.md"];
const textExtensions = new Set([".css", ".csv", ".js", ".jsx", ".json", ".md", ".mjs", ".sql", ".ts", ".tsx", ".txt"]);

async function collect(path) {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) await collect(child);
    else if (textExtensions.has(extname(entry.name))) files.push(child);
  }
}

for (const root of roots) await collect(root);
const failures = [];
for (const file of files) {
  const source = await readFile(file, "utf8").catch(() => "");
  if (source.includes(forbidden)) failures.push(file);
}

if (failures.length) {
  console.error(`Forbidden punctuation found in:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`Punctuation check passed across ${files.length} text files.`);
