import { useEffect } from 'react';

import { ImageSearch } from '../logic/ImageSearch';
import { Breeds } from '../logic/Breeds';
import { GameLogic } from '../logic/GameLogic';
import { SearchTerms } from '../logic/SearchTerms';

import {
  useObject,
  useArray,
  useInstances,
  useInstance,
  HooksProxy,
} from 'object-hooks';

export const useGameLogic = () => {
  const [breeds] = useInstance(Breeds);
  const [terms, resetTerms] = useInstance(SearchTerms, breeds);
  const [counts, resetCounts] = useObject<Record<string, number>>({});
  const [searches, resetSearches] = useArray<HooksProxy<ImageSearch>>([]);
  const createSearch = useInstances(ImageSearch);

  const [logic, resetGame] = useInstance(
    GameLogic,
    terms,
    counts,
    searches,
    createSearch
  );

  const onImageClick = (search: ImageSearch & AsyncIterable<ImageSearch>) => (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    logic.startSelectMode(search);
  };

  useEffect(() => {
    breeds.load();
  }, [breeds]);

  return {
    logic,
    counts,
    searches,
    terms,
    reset: () => {
      resetCounts();
      resetSearches();
      resetTerms();
      resetGame();
    },
    onImageClick,
    breeds,
  };
};
