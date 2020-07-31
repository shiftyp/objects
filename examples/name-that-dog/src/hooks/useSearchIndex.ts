import { useRef } from 'react'
import { useObject } from '@objects/hooks'
import { Stateful } from '@objects/types'
import { BreedTerms, SearchIndex } from '../types'

export const useSearchIndex = (searchTerms: Stateful<BreedTerms>) => {
  const searchId = useRef<number>(0)
  const [searches, resetSearches] = useObject<SearchIndex>({})

  const getTermsArray = () => {
    if (searchTerms.primary === null) {
      return []
    }

    const ret = [searchTerms.primary]

    if (searchTerms.secondary) {
      ret.push(searchTerms.secondary)
    }

    return ret
  }

  const addSearch = () => {
    const terms = getTermsArray()

    searches[searchId.current++] = terms
  }

  return {
    searches,
    addSearch,
    reset: resetSearches,
  }
}
