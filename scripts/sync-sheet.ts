import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SHEET_ID = process.env.SHEET_ID;
const GID = process.env.SHEET_GID ?? "0";

if (!SHEET_ID) {
  console.error("SHEET_ID environment variable is required");
  process.exit(1);
}

const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv&gid=${GID}`;

const PLACEHOLDER_EMAIL = "placeholder@placeholder.ca";
const EMAIL_COL = 1; // 0-indexed: researcherEmail is the second column

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data.tsv");

async function main() {
  console.log("Fetching sheet...");
  const res = await fetch(EXPORT_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`);
  }

  const tsv = await res.text();
  const lines = tsv.split("\n");

  const scrubbed = lines.map((line, i) => {
    if (i === 0) return line; // header row
    const cols = line.split("\t");
    if (cols.length > EMAIL_COL) {
      cols[EMAIL_COL] = PLACEHOLDER_EMAIL;
    }
    return cols.join("\t");
  });

  writeFileSync(OUT_PATH, scrubbed.join("\n"));
  const dataRows = lines.length - 1;
  console.log(`Wrote ${dataRows} rows to src/data.tsv (emails scrubbed)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
