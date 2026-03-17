import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table'
import { datasets, datasetTypes, institutions, diseases, drugs } from './data'
import type { Dataset, FilterState } from './types'
import './styles.css'

const columnHelper = createColumnHelper<Dataset>()

const columns: ColumnDef<Dataset, any>[] = [
  columnHelper.accessor('research', {
    header: 'Research',
    cell: (info) => (
      <div className="font-medium text-gray-900">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('researcherEmail', {
    header: 'Researcher Email',
    cell: (info) => (
      <a href={`mailto:${info.getValue()}`} className="text-sm text-blue-600 hover:text-blue-800">
        {info.getValue()}
      </a>
    ),
  }),
  columnHelper.accessor('institution', {
    header: 'Institution',
    cell: (info) => (
      <span className="text-sm text-gray-700">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('datasetName', {
    header: 'Dataset Name',
    cell: (info) => (
      <div className="font-medium text-gray-900">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('datasetDescription', {
    header: 'Dataset Description',
    cell: (info) => (
      <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('datasetType', {
    header: 'Dataset Type',
    cell: (info) => (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('disease', {
    header: 'Disease',
    cell: (info) => (
      <span className="text-sm text-gray-700">{info.getValue() || 'N/A'}</span>
    ),
  }),
  columnHelper.accessor('drug', {
    header: 'Drug',
    cell: (info) => (
      <span className="text-sm text-gray-700">{info.getValue() || 'N/A'}</span>
    ),
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono text-blue-600 hover:text-blue-800"
      >
        {info.getValue()}
      </a>
    ),
  }),
]

function App() {
  const [filters, setFilters] = useState<FilterState>({
    datasetType: null,
    institution: null,
    disease: null,
    drug: null,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  // Filter datasets based on selected filters
  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      if (filters.datasetType && dataset.datasetType !== filters.datasetType) {
        return false
      }
      if (filters.institution && dataset.institution !== filters.institution) {
        return false
      }
      if (filters.disease && dataset.disease !== filters.disease) {
        return false
      }
      if (filters.drug && dataset.drug !== filters.drug) {
        return false
      }
      return true
    })
  }, [filters])

  const clearFilters = () => {
    setFilters({ datasetType: null, institution: null, disease: null, drug: null })
  }

  const hasActiveFilters = filters.datasetType || filters.institution || filters.disease || filters.drug

  // Table setup
  const table = useReactTable({
    data: filteredDatasets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">TridentDataHub</h1>
          <p className="text-gray-600 mt-1">Browse and filter research datasets</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Filter Datasets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Dataset Type Filter */}
              <div>
                <label
                  htmlFor="datasetType-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Dataset Type
                </label>
                <select
                  id="datasetType-filter"
                  value={filters.datasetType || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, datasetType: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Dataset Types</option>
                  {datasetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Filter */}
              <div>
                <label
                  htmlFor="institution-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Institution
                </label>
                <select
                  id="institution-filter"
                  value={filters.institution || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, institution: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Institutions</option>
                  {institutions.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disease Filter */}
              <div>
                <label
                  htmlFor="disease-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Disease
                </label>
                <select
                  id="disease-filter"
                  value={filters.disease || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, disease: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Diseases</option>
                  {diseases.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drug Filter */}
              <div>
                <label
                  htmlFor="drug-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Drug
                </label>
                <select
                  id="drug-filter"
                  value={filters.drug || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, drug: e.target.value || null })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Drugs</option>
                  {drugs.map((drug) => (
                    <option key={drug} value={drug}>
                      {drug}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredDatasets.length} of {datasets.length} datasets
            </div>
          </div>

          {/* Dataset Table */}
          {filteredDatasets.length > 0 ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center gap-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No datasets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
