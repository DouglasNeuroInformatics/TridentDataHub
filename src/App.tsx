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
        if (activeInstitutions.size > 0 && !activeInstitutions.has(d.institution)) return false;
        if (activeCustomTags.size > 0 && ![...activeCustomTags].every(t => d.tags.includes(t))) return false;
        return true;
      }),
    [activeInstitutions, activeCustomTags],
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
          <img
            src={`${import.meta.env.BASE_URL}white_horz_logo.jpg`}
            alt="Trident Preclinical Trials"
            className="logo"
          />
          <h1 className="title">Data Hub</h1>
        </div>
      </header>

      <main className="wrap main">
        <div className="tag-bar">
          <span className="tag-bar-label">Institution</span>
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

        {/* Custom tag pills — AND */}
        <div className="tag-bar">
          <span className="tag-bar-label">Tags</span>
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
    </>
  );
}

export default App;