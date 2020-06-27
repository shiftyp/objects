import { useObject, useBehavior } from '@objects/hooks';
import { Stateful } from '@objects/types';
import { from } from 'rxjs';

import { ImageSearch } from '../logic/ImageSearch';

export const useBreedCounts = (searches: Stateful<Record<number, string[]>>) => {
  const [counts, reset] = useObject<Record<string, number>>({});

  const observer = {
    next: (changes: Record<number, string[]>) => {
      for (const key of Object.keys(changes)) {
        const index = parseInt(key, 10);

        if (!isNaN(index)) {
          const oldBreed = searches[index]?.join(' ');
          const newBreed = changes[index]?.join(' ');

          if (oldBreed === undefined && newBreed) {
            counts[newBreed] = (counts[newBreed] || 0) + 1;
          } else if (oldBreed && newBreed === undefined) {
            counts[oldBreed] = (counts[oldBreed] || 1) - 1;

            if (!counts[oldBreed]) {
              delete counts[oldBreed];
            }
          }
        }
      }
    },
  };

  useBehavior(() => {
    // @ts-ignore
    return from(searches).subscribe(observer);
  }, [searches]);

  return { counts, reset };
};
