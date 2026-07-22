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
const EMAIL_HEADER = "Researcher Email";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data.tsv");

async function main() {
  console.log("Fetching sheet...");
  const res = await fetch(EXPORT_URL, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`);
  }

  const tsv = await res.text();
  // Google exports CRLF. Normalise to LF so the committed file is stable and
  // diffs show only the rows that actually changed. Drop any trailing blank
  // line so a single trailing newline is written below.
  const lines = tsv.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");

  const headers = lines[0]?.split("\t").map((c) => c.trim()) ?? [];
  const emailCol = headers.indexOf(EMAIL_HEADER);
  if (emailCol === -1) {
    throw new Error(`Header validation failed: '${EMAIL_HEADER}' column not found`);
  }

  const scrubbed = lines.map((line, i) => {
    if (i === 0) return line;
    const cols = line.split("\t");
    if (cols.length > emailCol) {
      cols[emailCol] = PLACEHOLDER_EMAIL;
    }
    return cols.join("\t");
  });

  writeFileSync(OUT_PATH, scrubbed.join("\n") + "\n");
  const dataRows = lines.length - 1;
  console.log(`Wrote ${dataRows} rows to src/data.tsv (emails scrubbed)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
