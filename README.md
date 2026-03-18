

# TridentDataHub

A modern web application for browsing and filtering research datasets with a clean, responsive interface.  
https://douglasneuroinformatics.github.io/TridentDataHub/



## Dataset Schema

```typescript
interface Dataset {
  researcher: string; // Primary researcher name
  researcherEmail: string; // Researcher email address
  institution: string; // Research institution or organization
  datasetName: string; // Name of the dataset
  datasetDescription: string; // Detailed description of the dataset
  datasetType: string; // Type/category of research data
  disease: string; // Associated disease
  drug: string; // Associated drug/intervention
  url: string; // URL to access the dataset
}
```

## Adding Datasets

Datasets are stored in `src/data.tsv` using tab-separated values format.

### TSV Format

```tsv
researcher\tresearcherEmail\tinstitution\tdatasetName\tdatasetDescription\tdatasetType\tdisease\tdrug\turl
Dr. Stephanie Tullo\ts.tullo@placeholder.ca\tDouglas\tDataset Name\tDescription here\tDataset Type\tDisease\tDrug\thttps://doi.org/10.xxxx/xxxxxx
```

### Field Guidelines

- **Use tabs** between columns (not spaces)
- **Consistent dataset types** for effective filtering
- **Use "NA"** for non-applicable disease/drug fields
- **DOI links** preferred when available
- **Descriptive names** including manuscript titles when applicable

## Features

- **Multi-Filter System**: Filter by dataset type, institution, disease, and drug
- **Sortable Columns**: Click column headers to sort ascending/descending
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean Table Layout**: Professional styling with hover effects
- **Email Integration**: Clickable email addresses for researcher contact

## Development

### Technical Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TanStack Table** for advanced table functionality

### Project Structure

```
TridentDataHub/
├── src/
│   ├── types.ts          # TypeScript type definitions
│   ├── data.tsv          # Dataset data (tab-separated values)
│   ├── data.ts           # TSV parser and filter exports
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
