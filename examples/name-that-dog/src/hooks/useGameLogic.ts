import { Stateful } from '@objects/types';

import { ImageSearch } from '../logic/ImageSearch';
import { useBreeds } from './useBreeds';
import { useSearchTerms } from './useSearchTerms';

import { useGameModes } from './useGameModes';
import { useGameSelection } from './useGameSelection';
import { useSearches } from './useSearches';

export const useGameLogic = () => {
  const { randomMode, selectionMode, reset: resetGameModes } = useGameModes();
  const { selection, reset: resetGameSelection } = useGameSelection(selectionMode);
  const { collection } = useBreeds();
  const { terms, lists, randomize, reset: resetTerms } = useSearchTerms(
    collection,
    randomMode
  );
  const { searches, addSearch, reset: resetSearches } = useSearches(terms);

  const selectBreed = (breed: string) => {
    if (selection.image && selection.image.breed === breed) {
      delete searches[selection.image.id];
      selection.image = null;
    }
  };

  const createOnImageClick = (search: Stateful<ImageSearch>) => (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    selection.image = search;
  };

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
    reset: () => {
      resetGameModes();
      resetGameSelection();
      resetTerms();
      resetSearches();
    },
    selectBreed,
    createOnImageClick,
  };
};
