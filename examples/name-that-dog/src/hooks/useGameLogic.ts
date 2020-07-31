import { useBreeds } from './useBreeds'
import { useSearchTerms } from './useSearchTerms'

import { useGameModes } from './useGameModes'
import { useGameSelection } from './useGameSelection'
import { useSearchIndex } from './useSearchIndex'

export const useGameLogic = () => {
  const { randomMode, selectionMode } = useGameModes()
  const { collection } = useBreeds()
  const { selection } = useGameSelection(selectionMode)
  const { terms, lists, randomize } = useSearchTerms(collection, randomMode)
  const { searches, addSearch, reset } = useSearchIndex(terms)

  const selectBreed = (breed: string) => {
    if (selection.dog && selection.dog.terms.join(' ') === breed) {
      delete searches[selection.dog.id]
      selection.dog = null
    }
  }

  const createOnImageClick = (id: string, terms: string[]) => (
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    selection.dog = {
      id,
      terms,
    }
  }

  return {
    lists: lists,
    breedsCollection: collection,
    selectionMode: selectionMode,
    randomMode: randomMode,
    selection: selection,
    searches: searches,
    addSearch: addSearch,
    terms: terms,
    randomize: randomize,
    reset,
    selectBreed,
    createOnImageClick,
  }
}
