import type { Dataset } from "./types";

// Parse TSV data
const HEADER_MAP: Record<string, keyof Dataset> = {
  "Researcher": "researcher",
  "Researcher Email": "researcherEmail",
  "Institution": "institution",
  "Dataset Name": "datasetName",
  "Dataset Description": "datasetDescription",
  "Dataset Type": "datasetType",
  "Disease": "disease",
  "Drug": "drug",
  "URL": "url",
  "Tags": "tags",
};

function parseTSV(tsvContent: string): Dataset[] {
  const lines = tsvContent.trim().split("\n");
  const headers = lines[0].split("\t").map((h) => h.trim());

  const colIndex = Object.fromEntries(
    Object.entries(HEADER_MAP).map(([header, field]) => [field, headers.indexOf(header)])
  ) as Record<keyof Dataset, number>;

  const missingCols = Object.entries(colIndex)
    .filter(([, idx]) => idx === -1)
    .map(([field]) => field);
  if (missingCols.length > 0) {
    console.error(`Missing columns in TSV: ${missingCols.join(", ")}`);
  }

  const datasets: Dataset[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t").map((v) => v.trim());
    const col = (key: keyof Dataset) => {
      const idx = colIndex[key];
      return idx >= 0 ? values[idx] ?? "" : "";
    };
    const dataset: Dataset = {
      researcher: col("researcher"),
      researcherEmail: col("researcherEmail"),
      institution: col("institution"),
      datasetName: col("datasetName"),
      datasetDescription: col("datasetDescription"),
      datasetType: col("datasetType"),
      disease: col("disease"),
      drug: col("drug"),
      url: col("url"),
      tags: col("tags") ? col("tags").split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    datasets.push(dataset);
  }

  return datasets;
}

// Import TSV file
// @ts-expecter-error - Vite handles ?raw imports
import dataTsvContent from "./data.tsv?raw";

export const datasets: Dataset[] = parseTSV(dataTsvContent);

// Debug: Check parsing
if (import.meta.env.DEV) {
  console.debug("Datasets parsed:", datasets.length);
}

export const allTags = Array.from(
  new Set(datasets.flatMap((d) => d.tags))
).sort();
export const allInstitutions = Array.from(
  new Set(datasets.map((d) => d.institution).filter(Boolean))
).sort();