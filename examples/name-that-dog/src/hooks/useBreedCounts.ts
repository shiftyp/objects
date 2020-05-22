import {
  Stateful,
  useObject,
  observe,
} from 'object-hooks';
import { ImageSearch } from '../logic/ImageSearch';
import { useEffect } from 'react';

export const useBreedCounts = (
  searches: Stateful<
    Record<number, Stateful<ImageSearch>>
  >
) => {
  const [counts, reset] = useObject<
    Record<string, number>
  >({});

  const observer = {
    next: (
      changes: Record<
        number,
        Stateful<ImageSearch> | undefined
      >
    ) => {
      if (oldSearch === undefined && newSearch) {
        counts[newSearch.breed] =
          (counts[newSearch.breed] || 0) + 1;
      } else if (
        oldSearch &&
        newSearch === undefined
      ) {
        counts[oldSearch.breed] =
          (counts[oldSearch.breed] || 1) - 1;

        if (!counts[oldSearch.breed]) {
          delete counts[oldSearch.breed];
        }
      }
    },
  };

  useEffect(() => {
    const unobserve = observe(searches, observer);
    return () => {
      reset();
      unobserve();
    };
  }, [searches]);

  return { counts, reset };
};
