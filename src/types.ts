export interface Dataset {
  research: string
  researcherEmail: string
  institution: string
  datasetName: string
  datasetDescription: string
  datasetType: string
  disease?: string
  drug?: string
  url: string
}

export interface FilterState {
  datasetType: string | null
  institution: string | null
  disease: string | null
  drug: string | null
}

