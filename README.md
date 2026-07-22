# TridentDataHub

A searchable, public catalogue of research datasets from the Trident network. Browse it here: [data.tridentpreclinicaltrials.org](https://data.tridentpreclinicaltrials.org/).

The site does not host data. Each entry is a short description plus a link to wherever the data actually lives (Zenodo, OSF, a DOI, an institutional repository).

---

## For researchers: adding your dataset

You do not need to touch this repository, install anything, or know Git. All entries come from a shared Google Sheet. Add a row to the sheet, and your dataset appears on the site after the next sync.

**Ask the maintainers for the sheet link if you don't have it.**

### One row = one dataset

Fill in every column. Here is what each one means:

| Column | What to put | Example |
| --- | --- | --- |
| **Researcher** | Name of the person to contact about the dataset | `Stephanie Tullo` |
| **Researcher Email** | Contact email. **Removed before publishing** — see the privacy note below | `you@example.ca` |
| **Institution** | Your institution or site. Becomes a filter on the site, so match the spelling others use | `Douglas` |
| **Dataset Name** | Short title. If it accompanies a paper, use the manuscript title | `Dataset for manuscript titled: Female mice exhibit resistance to...` |
| **Dataset Description** | A few sentences: what the data is, how it was collected, what it was used for. Written for someone outside your lab | `This repository contains the source data and code for the analyses in...` |
| **Dataset Type** | What form the data takes | `source data (demographics (csv), MRI statistical maps (MINC), behavioural data (csv)) and code` |
| **Disease** | Disease or condition studied. Use `NA` if not applicable | `Synucleinopathies` |
| **Drug** | Drug or compound studied. Use `NA` if not applicable | `NA` |
| **URL** | Link to the data. A DOI is strongly preferred over a Drive or Dropbox link | `https://doi.org/10.5281/zenodo.14655730` |
| **Tags** | Comma-separated keywords. Become clickable filters on the site | `source-data, mouse, MRI, synucleinopathies, in-vivo` |

### Tips that make your entry easier to find

- **Reuse existing values.** Before inventing a new institution name, dataset type, or tag, scroll the sheet and copy how others wrote it. `MRI` and `mri` are treated as two different tags.
- **Never leave a cell blank.** Write `NA` instead. Blank cells can shift the row and garble the entry.
- **Don't press Tab or Enter inside a cell.** The sheet is exported as tab-separated text, so a stray tab or line break inside a description breaks the columns. Paste as plain text if you're copying from Word.
- **Descriptions are searchable.** Include the terms someone would actually type when hunting for this data.
- **Use a permanent link.** If your data is on a lab server or a personal Drive folder, the link will rot. Deposit it somewhere with a DOI first if you can.

### Privacy note about your email

The sync script replaces every address in the **Researcher Email** column with `placeholder@placeholder.ca` before anything is committed or published. Your real address stays in the private Google Sheet and never reaches the public site or the repository history. Maintainers use it to reach you about your entry.

### When will my dataset show up?

Within about a day. A job checks the sheet every morning and, if anything changed, opens a pull request for a maintainer to review. Once they merge it, the site updates within a few minutes. Ping a maintainer if you need it live sooner.

---

## For maintainers: syncing the sheet

A scheduled workflow (`.github/workflows/sync-sheet.yml`) runs daily at 06:00 UTC:

1. Fetches the sheet and writes `src/data.tsv`, scrubbing emails.
2. If `data.tsv` is unchanged, it stops — no branch, no PR.
3. If it changed, it force-pushes the `sync/google-sheet` branch and opens a PR (or updates the open one, so repeat runs never stack up PRs).
4. Merging the PR to `main` triggers `deploy.yml` and the site redeploys.

Nothing publishes without a human merging. Review the diff for garbled rows before merging — a stray tab or line break in a sheet cell shifts every column after it.

Run it early with **Actions > Sync Google Sheet > Run workflow**.

### Setup

- Repository variable `SHEET_ID` — the sheet's ID from its URL.
- Repository variable `SHEET_GID` — optional, only if the data is not on the first tab.
- Settings > Actions > General > **Allow GitHub Actions to create and approve pull requests** must stay enabled, or the PR step fails.

### Running locally

```bash
SHEET_ID=<sheet-id> pnpm sync
```

Writes `src/data.tsv` in place; commit it yourself. The script aborts if the `Researcher Email` header is missing, rather than publishing unscrubbed addresses — do not rename that column in the sheet.

## Site features

- **Tag-based filtering** — filter by institution and custom tags using clickable pills
- **Sortable columns** — click column headers to sort ascending/descending
- **Responsive design** — works on desktop, tablet, and mobile
- **Clickable contact** — email addresses link directly to `mailto:`

## Development

### Dataset schema

```typescript
interface Dataset {
  researcher: string;
  researcherEmail: string;
  institution: string;
  datasetName: string;
  datasetDescription: string;
  datasetType: string;
  disease: string;
  drug: string;
  url: string;
  tags: string[];
}
```

### Tech stack

- **React 19** + TypeScript
- **Vite** for development and building
- **TanStack Table** for data grid functionality
- **pnpm** for package management

### Project structure

```
TridentDataHub/
├── src/
│   ├── types.ts           # Dataset and FilterState type definitions
│   ├── data.tsv           # Dataset records (tab-separated values)
│   ├── data.ts            # TSV parser and filter option exports
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point
│   ├── styles.css         # Global styles and CSS variables
│   └── index.css          # Base styles
├── public/
│   ├── white_horz_logo.jpg
│   └── trident-icon.svg
├── scripts/
│   └── sync-sheet.ts      # Fetches Google Sheet and scrubs emails
├── index.html
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

### Available scripts

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm build                # Build for production
pnpm preview              # Preview production build
pnpm lint                 # Run ESLint
pnpm sync                 # Sync data from Google Sheet (requires SHEET_ID env var)
```
