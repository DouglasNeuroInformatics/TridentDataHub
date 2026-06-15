# TridentDataHub

A web application for browsing and filtering research datasets. Find it here: [Trident Data Hub](https://douglasneuroinformatics.github.io/TridentDataHub/).

## Dataset Schema

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
}
```

## Adding Datasets

Datasets are managed in a Google Sheet and synced to `src/data.tsv` via a script that scrubs researcher emails before committing.

### Syncing from Google Sheet

**Via GitHub Actions (recommended):**

1. Add the sheet ID as a repository variable: `SHEET_ID`
2. Go to **Actions > Sync Google Sheet > Run workflow**
3. The workflow fetches the sheet, scrubs emails, and commits the updated `data.tsv`. The site redeploys automatically.

**Locally:**

```bash
SHEET_ID=<sheet-id> pnpm sync
```

### Field Guidelines

- **Use tabs** between columns (not spaces)
- **Consistent dataset types** for effective filtering
- **Use "NA"** for non-applicable disease/drug fields
- **DOI links** preferred when available
- **Descriptive names** including manuscript titles when applicable

## Features

- **Multi-filter system** — filter by dataset type, institution, disease, and drug
- **Per-option counts** — filter dropdowns show how many rows match each option
- **Sortable columns** — click column headers to sort ascending/descending
- **Responsive design** — works on desktop, tablet, and mobile
- **Clickable contact** — email addresses link directly to `mailto:`

## Development

### Tech Stack

- **React 19** + TypeScript
- **Vite** for development and building
- **TanStack Table** for data grid functionality
- **pnpm** for package management

### Project Structure

```
TridentDataHub/
├── src/
│   ├── types.ts          # Dataset and FilterState type definitions
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

### Available Scripts

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm build                # Build for production
pnpm preview              # Preview production build
pnpm lint                 # Run ESLint
pnpm sync                 # Sync data from Google Sheet (requires SHEET_ID env var)
```

