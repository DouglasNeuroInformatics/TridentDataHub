import { useState, useMemo } from "react";
import {
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { datasets, allTags, allInstitutions } from "./data";
import type { Dataset } from "./types";
import "./styles.css";


type MatchMode = "AND" | "OR";

function ModeToggle({ mode, onChange }: { mode: MatchMode; onChange: (m: MatchMode) => void }) {
  return (
    <span className="mode-toggle" role="group" aria-label="Match mode">
      {(["AND", "OR"] as const).map((m) => (
        <button
          key={m}
          type="button"
          className={`mode-btn ${mode === m ? "mode-btn--active" : ""}`}
          aria-pressed={mode === m}
          onClick={() => onChange(m)}
        >
          {m}
        </button>
      ))}
    </span>
  );
}

const columnHelper = createColumnHelper<Dataset>();

// Trailing path segments that carry no identifying information.
const NOISE_SEGMENTS = new Set(["overview", "view", "files", "record", "records"]);

// Show the meaningful part of a source URL (the DOI / record / repo identifier)
// rather than the bare host. Falls back to the raw string on parse failure.
function formatSourceLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.host.replace(/^www\./, "");
    const segments = u.pathname.split("/").filter(Boolean);

    // DOIs: the path *is* the identifier, e.g. 10.5281/zenodo.14655730
    if (host === "doi.org") return segments.join("/") || host;

    // Otherwise host + meaningful path, e.g. osf.io/tyhce,
    // github.com/vik16nathan/allen_connectome_qc
    const meaningful = segments.filter((s) => !NOISE_SEGMENTS.has(s.toLowerCase()));
    return meaningful.length ? `${host}/${meaningful.join("/")}` : host;
  } catch {
    return url;
  }
}

const columns = [
  columnHelper.accessor("researcher", { header: "Researcher" }),
  columnHelper.accessor("institution", { header: "Institution" }),
  columnHelper.accessor("datasetName", { header: "Dataset" }),
  columnHelper.accessor("datasetDescription", {
    header: "Description",
    cell: (info) => (
      <span className="desc" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("datasetType", { header: "Type" }),
  columnHelper.accessor("disease", {
    header: "Disease",
    cell: (info) => info.getValue() || <span className="null">—</span>,
  }),
  columnHelper.accessor("drug", {
    header: "Drug",
    cell: (info) => info.getValue() || <span className="null">—</span>,
  }),
  columnHelper.accessor("url", {
    header: "Source",
    cell: (info) => {
      const url = info.getValue();
      if (!url) return <span className="null">—</span>;
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="link">
          {formatSourceLabel(url)}
        </a>
      );
    },
  }),
];

function App() {
  const [activeInstitutions, setActiveInstitutions] = useState<Set<string>>(new Set());
  const [activeCustomTags, setActiveCustomTags] = useState<Set<string>>(new Set());
  const [institutionMode, setInstitutionMode] = useState<MatchMode>("OR");
  const [tagMode, setTagMode] = useState<MatchMode>("AND");
  const [sorting, setSorting] = useState<SortingState>([]);

  const toggleTag = (tag: string, isInstitution: boolean) => {
    const setter = isInstitution ? setActiveInstitutions : setActiveCustomTags;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((d) => {
        if (activeInstitutions.size > 0) {
          const insts = [...activeInstitutions];
          const ok = institutionMode === "OR"
            ? insts.some((i) => i === d.institution)
            : insts.every((i) => i === d.institution);
          if (!ok) return false;
        }
        if (activeCustomTags.size > 0) {
          const tags = [...activeCustomTags];
          const ok = tagMode === "AND"
            ? tags.every((t) => d.tags.includes(t))
            : tags.some((t) => d.tags.includes(t));
          if (!ok) return false;
        }
        return true;
      }),
    [activeInstitutions, activeCustomTags, institutionMode, tagMode],
  );



  const table = useReactTable({
    data: filteredDatasets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <>
      <header className="header">
        <div className="wrap">
          <a
            href="https://www.tridentpreclinicaltrials.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="home-link"
            aria-label="Trident Preclinical Trials home"
          >
            <img
              src={`${import.meta.env.BASE_URL}white_horz_logo.jpg`}
              alt="Trident Preclinical Trials"
              className="logo"
            />
            <h1 className="title">Data Hub</h1>
          </a>
        </div>
      </header>

      <main className="wrap main">
        <p className="preamble">
          The Trident Data Hub is a catalogue of open research datasets from the Trident
          Preclinical Trials network. Filter by institution and tags, sort the columns, and
          follow the source links to access each dataset at its repository.
        </p>

        <div className="tag-bar">
          <span className="tag-bar-label">Institution</span>
          <ModeToggle mode={institutionMode} onChange={setInstitutionMode} />
          {allInstitutions.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-pill ${activeInstitutions.has(tag) ? "tag-pill--active" : ""}`}
              onClick={() => toggleTag(tag, true)}
            >
              {tag}
            </button>
          ))}
          {activeInstitutions.size > 0 && (
            <button type="button" className="clear-all"
              onClick={() => setActiveInstitutions(new Set())}>
              Clear
            </button>
          )}
        </div>

        {/* Custom tag pills — AND/OR selectable */}
        <div className="tag-bar">
          <span className="tag-bar-label">Tags</span>
          <ModeToggle mode={tagMode} onChange={setTagMode} />
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-pill ${activeCustomTags.has(tag) ? "tag-pill--active" : ""}`}
              onClick={() => toggleTag(tag, false)}
            >
              {tag}
            </button>
          ))}
          {activeCustomTags.size > 0 && (
            <button type="button" className="clear-all"
              onClick={() => setActiveCustomTags(new Set())}>
              Clear
            </button>
          )}
        </div>

        <p className="count" role="status" aria-live="polite">
          Showing {filteredDatasets.length} of {datasets.length}
        </p>

        {/* Table */}
        <section aria-labelledby="table-heading" className="table-section" style={{ minHeight: "70vh" }}>
          <h2 id="table-heading" className="sr-only">Datasets</h2>
          {filteredDatasets.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((h) => {
                        const s = h.column.getIsSorted() as false | "asc" | "desc";
                        return (
                          <th key={h.id} scope="col"
                            aria-sort={s === "asc" ? "ascending" : s === "desc" ? "descending" : "none"}>
                            <button type="button" className="sort-btn"
                              onClick={h.column.getToggleSortingHandler()}>
                              {flexRender(h.column.columnDef.header, h.getContext())}
                              <span className="sort-indicator" aria-hidden="true">
                                {s === "asc" ? "↑" : s === "desc" ? "↓" : "↕"}
                              </span>
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <p className="empty-msg">No datasets match these tags.</p>
              <button type="button" className="clear-all"
                onClick={() => { setActiveInstitutions(new Set()); setActiveCustomTags(new Set()); }} >
                Clear tags
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a
          href="https://github.com/DouglasNeuroInformatics/TridentDataHub"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="View source on GitHub"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
        <span className="footer-sep" aria-hidden="true">·</span>
        <span className="footer-credit">
          Developed by{" "}
          <a
            href="https://douglasneuroinformatics.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Douglas Neuroinformatics Platform
          </a>
        </span>
      </footer>
    </>
  );
}

export default App;