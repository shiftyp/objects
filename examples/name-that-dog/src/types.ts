export type BreedsRecord = Record<string, string[]>

export interface ArticleData {
  href: string
  title: string
}

export type ArticleApiResponse = [string, string[], string[], string[]]

export interface DogApiResponse<Data> {
  message: Data
}

export interface ApiOptions<Data, Response> {
  transform: (response: Response) => Data
  apiBase: string
  apiSuffix?: string
}

export interface BreedTerms {
  primary: string | null
  secondary: string | null
}

export type BreedTermsList = string[]

export interface BreedLists {
  primary: string[]
  secondary: string[]
}

export interface Mode {
  value: boolean
}

export type SearchIndex = Record<string, BreedTermsList>

export type BreedCounts = Record<string, number>
