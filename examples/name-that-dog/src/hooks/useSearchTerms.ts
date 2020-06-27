import { useCallback, useEffect } from 'react';
import { useInstance, useBehavior, useObject } from '@objects/hooks';
import { Stateful } from '@objects/types';
import { changes, changed } from '@objects/operators';
import { map, take } from 'rxjs/operators';

import { BreedTerms } from '../logic/BreedTerms';
import { BreedsCollection } from '../logic/BreedsCollection';
import { Mode } from '../logic/Mode';

export const useSearchTerms = (
  breeds: Stateful<BreedsCollection>,
  randomMode: Stateful<Mode>
) => {
  const [terms, resetTerms] = useInstance(BreedTerms);
  const [lists, resetLists] = useObject({
    primaryList: [] as string[],
    secondaryList: [] as string[],
  });

  const reset = () => {
    resetTerms();
    resetLists();
  };

  const randomize = useCallback(async () => {
    const selectRandom = (arr: string[]) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };
    terms.selected = selectRandom(lists.primaryList);
    terms.secondarySelected = selectRandom(lists.secondaryList);
  }, [terms, lists]);

  useBehavior(
    () =>
      changes(randomMode).value.subscribe((value) => {
        if (value) {
          randomize();
        }
      }),
    [randomMode]
  );

  useBehavior(
    () =>
      changes(breeds)
        .data.pipe(map((data) => (data ? Object.keys(data) : [])))
        .subscribe(changes(lists).primaryList),
    [breeds, lists]
  );

  useBehavior(() => changed(lists).primaryList.subscribe(() => randomize()), [
    lists,
  ]);

  useBehavior(
    () =>
      changes(terms)
        .selected.pipe(
          map((selected) =>
            selected && breeds.data?.[selected] ? breeds.data[selected] : []
          )
        )
        .subscribe(changes(lists).secondaryList),
    [terms, lists]
  );

  return {
    terms,
    lists,
    randomize,
    reset,
  };
};
