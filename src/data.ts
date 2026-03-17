import type { Dataset } from './types'

export const datasets: Dataset[] = [
  {
    research: 'Cancer Immunotherapy Research',
    researcherEmail: 'sarah.chen@uaf.edu',
    institution: 'University of Alaska Fairbanks',
    datasetName: 'Immunotherapy Response Biomarkers',
    datasetDescription: 'Biomarker data from clinical trials studying patient response to immunotherapy treatments.',
    datasetType: 'Clinical Trial Data',
    disease: 'Melanoma',
    drug: 'Pembrolizumab',
    url: 'https://doi.org/10.11587/ABCD1234'
  },
  {
    research: 'Neurodegenerative Disease Study',
    researcherEmail: 'james.wilson@ubc.ca',
    institution: 'University of British Columbia',
    datasetName: "Alzheimer's Progression Markers",
    datasetDescription: 'Longitudinal data tracking cognitive decline and biomarker changes in Alzheimer\'s patients.',
    datasetType: 'Longitudinal Study',
    disease: "Alzheimer's Disease",
    url: 'https://doi.org/10.5281/zenodo.11223344'
  },
  {
    research: 'Antibiotic Resistance Research',
    researcherEmail: 'margaret.brown@utoronto.ca',
    institution: 'University of Toronto',
    datasetName: 'MRSA Genomic Sequencing',
    datasetDescription: 'Whole genome sequences of methicillin-resistant Staphylococcus aureus isolates.',
    datasetType: 'Genomic Data',
    disease: 'MRSA Infection',
    drug: 'Vancomycin',
    url: 'https://doi.org/10.5281/zenodo.55667788'
  },
  {
    research: 'Cardiovascular Disease Research',
    researcherEmail: 'jennifer.martinez@mcgill.ca',
    institution: 'McGill University',
    datasetName: 'Heart Failure Clinical Trial Results',
    datasetDescription: 'Clinical outcomes data from phase III trials of new heart failure medications.',
    datasetType: 'Clinical Trial Data',
    disease: 'Heart Failure',
    drug: 'Sacubitril/Valsartan',
    url: 'https://doi.org/10.11587/WXYZ6789'
  },
  {
    research: 'Diabetes Research',
    researcherEmail: 'william.johnson@ualberta.ca',
    institution: 'University of Alberta',
    datasetName: 'Type 2 Diabetes Management Study',
    datasetDescription: 'Patient data comparing effectiveness of different diabetes management protocols.',
    datasetType: 'Clinical Study',
    disease: 'Type 2 Diabetes',
    drug: 'Metformin',
    url: 'https://doi.org/10.5281/zenodo.99887766'
  },
  {
    research: 'Rare Disease Research',
    researcherEmail: 'christopher.lewis@ubc.ca',
    institution: 'University of British Columbia',
    datasetName: 'Cystic Fibrosis Drug Response',
    datasetDescription: 'Data on patient response to CFTR modulator therapies in rare genetic mutations.',
    datasetType: 'Clinical Research',
    disease: 'Cystic Fibrosis',
    drug: 'Ivacaftor',
    url: 'https://doi.org/10.11587/LMNO3456'
  },
  {
    research: 'Mental Health Research',
    researcherEmail: 'andrew.young@utoronto.ca',
    institution: 'University of Toronto',
    datasetName: 'Depression Treatment Outcomes',
    datasetDescription: 'Long-term outcomes data for various depression treatment modalities.',
    datasetType: 'Longitudinal Study',
    disease: 'Major Depressive Disorder',
    drug: 'Sertraline',
    url: 'https://doi.org/10.5281/zenodo.33445566'
  },
  {
    research: 'Infectious Disease Research',
    researcherEmail: 'nancy.scott@mcgill.ca',
    institution: 'McGill University',
    datasetName: 'COVID-19 Vaccine Efficacy',
    datasetDescription: 'Immune response data from COVID-19 vaccine clinical trials.',
    datasetType: 'Clinical Trial Data',
    disease: 'COVID-19',
    drug: 'mRNA Vaccine',
    url: 'https://doi.org/10.11587/QRST7890'
  },
  {
    research: 'Autoimmune Disease Research',
    researcherEmail: 'steven.clark@ualberta.ca',
    institution: 'University of Alberta',
    datasetName: 'Rheumatoid Arthritis Biomarkers',
    datasetDescription: 'Biomarker data for early detection and monitoring of rheumatoid arthritis.',
    datasetType: 'Biomarker Study',
    disease: 'Rheumatoid Arthritis',
    drug: 'Methotrexate',
    url: 'https://doi.org/10.5281/zenodo.77889900'
  },
  {
    research: 'Oncology Research',
    researcherEmail: 'joshua.hill@utoronto.ca',
    institution: 'University of Toronto',
    datasetName: 'Lung Cancer Treatment Response',
    datasetDescription: 'Data on tumor response to targeted therapies in non-small cell lung cancer.',
    datasetType: 'Clinical Trial Data',
    disease: 'Lung Cancer',
    drug: 'Erlotinib',
    url: 'https://doi.org/10.11587/UVWX1234'
  },
]

// Extract unique values for filters
export const datasetTypes = Array.from(new Set(datasets.map(d => d.datasetType))).sort()
export const institutions = Array.from(new Set(datasets.map(d => d.institution))).sort()
export const diseases = Array.from(new Set(datasets.map(d => d.disease).filter(Boolean))).sort()
export const drugs = Array.from(new Set(datasets.map(d => d.drug).filter(Boolean))).sort()
