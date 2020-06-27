import { useRef, useEffect } from 'react';
import { useObject, useInstances, useInstance } from '@objects/hooks';
import { Stateful } from '@objects/types';

import { ImageSearch } from '../logic/ImageSearch';
import { BreedTerms } from '../logic/BreedTerms';

export const useImageSearch = (terms: string[]) => {
  const [imageSearch] = useInstance(ImageSearch, terms);

  useEffect(() => {
    imageSearch.search();
  }, [imageSearch]);

  return {
    imageSearch,
  };
};
