import { Stateful, useInstance, observeMap, observe } from 'object-hooks';
import { useCallback, useEffect } from 'react';
import { BreedTerms } from '../logic/BreedTerms';
import { BreedLists } from '../logic/BreedLists';
import { BreedsCollection } from '../logic/BreedsCollection';
import { Mode } from '../logic/Mode';

export const useSearchTerms = (
  breeds: Stateful<BreedsCollection>,
  randomMode: Stateful<Mode>
) => {
  const [terms, resetTerms] = useInstance(BreedTerms);
  const [lists, resestLists] = useInstance(BreedLists);

  const reset = () => {
    resetTerms();
    resestLists();
  };

  useEffect(() => {
    return observeMap(randomMode, {
      value: () => {
        randomize();
      },
    });
  }, [randomMode]);

  useEffect(() => {
    return observeMap(breeds, {
      data: (data) => {
        lists.primaryList = data ? Object.keys(data) : [];
        randomize();
      },
    });
  }, [breeds]);

  useObserveMap(terms, {
    selected: (selected) => {
      lists.secondaryList = breeds.data?.[selected] || [];
    },
  });

  const randomize = useCallback(async () => {
    const selectRandom = (arr: string[]) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };
    terms.selected = selectRandom(lists.primaryList);
    terms.secondarySelected = selectRandom(lists.secondaryList);
  }, [terms, lists]);

  return {
    terms,
    lists,
    randomize,
    reset,
  };
};
