import { useRef } from 'react';

import { Stateful, useObject, useInstances } from 'object-hooks';
import { ImageSearch } from '../logic/ImageSearch';
import { BreedTerms } from '../logic/BreedTerms';

export const useImageSearches = (terms: Stateful<BreedTerms>) => {
  const searchId = useRef<number>(0);
  const [searches, resetSearches] = useObject<
    Record<number, Stateful<ImageSearch>>
  >({});
  const createSearch = useInstances(ImageSearch);

  const addSearch = async () => {
    const imageSearch = createSearch(terms, searchId.current++);

    searches[imageSearch.id] = imageSearch;

    await imageSearch.search();
  };

  return {
    searches,
    addSearch,
    reset: resetSearches,
  };
};
