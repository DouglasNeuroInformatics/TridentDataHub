# TridentDataHub

A modern web application for browsing and filtering research datasets with a clean, responsive interface.

## Dataset Schema

```typescript
interface Dataset {
  researcher: string; // Primary researcher name
  researcherEmail: string; // Researcher email address
  institution: string; // Research institution or organization
  datasetName: string; // Name of the dataset
  datasetDescription: string; // Detailed description of the dataset
  datasetType: string; // Type/category of research data
  disease: string;              // Associated disease
  drug: string;                 // Associated drug/intervention
  url: string; // URL to access the dataset
}
```

## Adding Datasets

Edit `src/data.ts` to add new datasets. Use proper academic titles, placeholder emails for privacy, and be descriptive with dataset names and descriptions.

```typescript
import type { Dataset } from "./types";

export const datasets: Dataset[] = [
  {
    researcher: "Dr. Researcher Name",
    researcherEmail: "email@placeholder.ca",
    institution: "Institution Name",
    datasetName: "Your Dataset Name",
    datasetDescription: "Clear description of what the dataset contains",
    datasetType: "Dataset Type/Category",
    disease: "Associated Disease",
    drug: "Associated Drug (or NA)",
    url: "https://doi.org/10.xxxx/xxxxxx",
  },
];
```

**Best Practices:**

- Use consistent `datasetType` values for filtering
- Use "NA" for non-applicable `disease` or `drug` fields
- Include manuscript titles in dataset names when applicable
- Use proper DOI links when available

## Features

- **Multi-Filter System**: Filter by dataset type, institution, disease, and drug
- **Sortable Columns**: Click column headers to sort ascending/descending
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean Table Layout**: Professional styling with hover effects
- **Email Integration**: Clickable email addresses for researcher contact

## Development

### Technical Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Table** for advanced table functionality

### Project Structure

```
TridentDataHub/
├── src/
│   ├── types.ts          # TypeScript type definitions
│   ├── data.ts           # Dataset data and filter exports
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   ├── styles.css        # Global styles and CSS variables
│   └── index.css         # Additional styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

### Available Scripts

```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```
