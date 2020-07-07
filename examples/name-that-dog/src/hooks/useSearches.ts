import { useRef } from 'react'
import { useObject } from '@objects/hooks'
import { Stateful } from '@objects/types'

import { BreedTerms } from '../logic/BreedTerms'

export const useSearches = (searchTerms: Stateful<BreedTerms>) => {
  const searchId = useRef<number>(0)
  const [searches, resetSearches] = useObject<Record<string, string[]>>({})
  const addSearch = () => {
    const terms = searchTerms.toArray()

    searches[searchId.current++] = terms
  }

  return {
    searches,
    addSearch,
    reset: resetSearches,
  }
}
