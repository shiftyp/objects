import { DogApiResponse, ApiOptions, BreedTermsList, BreedTerms } from './types'
import { DOG_API_BASE, WIKI_API_BASE, WIKI_API_SUFFIX } from './constants'

export const shuffle = <T>(a: T[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const makeDogApiOptions = <Data>(): ApiOptions<
  Data,
  DogApiResponse<Data>
> => ({
  apiBase: DOG_API_BASE,
  transform: (response) => response.message,
})

export const makeWikiApiOptions = <Data, Response>(
  transform: ApiOptions<Data, Response>['transform']
): ApiOptions<Data, Response> => ({
  apiBase: WIKI_API_BASE,
  apiSuffix: WIKI_API_SUFFIX,
  transform,
})

export const toPath = (terms: BreedTermsList) => (terms ? terms.join('/') : null)
export const toBreed = (terms: BreedTermsList) => (terms ? terms.join(' ') : null)
