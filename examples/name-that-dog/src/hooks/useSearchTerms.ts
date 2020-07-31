import { useCallback, useEffect } from 'react'
import { useInstance, useObserve, useObject, useObjects } from '@objects/hooks'
import { Stateful } from '@objects/types'
import { changes, afterChanges } from '@objects/operators'
import { map, take, filter } from 'rxjs/operators'

import { Mode } from '../types'
import { BreedsRecord, BreedTerms, BreedLists } from '../types'
import { Update } from '../logic/Update'

export const useSearchTerms = (
  breeds: Update<BreedsRecord>,
  randomMode: Stateful<Mode>
) => {
  const [terms] = useObject({
    primary: null,
    secondary: null,
  } as BreedTerms)
  const [lists] = useObject({
    primary: [],
    secondary: [],
  } as BreedLists)

  const randomize = useCallback(
    (primary: boolean = true, secondary: boolean = true) => {
      const selectRandom = (arr: string[]) => {
        return arr[Math.floor(Math.random() * arr.length)]
      }
      if (primary) {
        terms.primary = selectRandom(lists.primary)
      }
      if (secondary) {
        terms.secondary = selectRandom(lists.secondary)
      }
    },
    [terms, lists]
  )

  useObserve(
    () =>
      changes(randomMode)
        .value.pipe(filter((value) => !!value))
        .subscribe(() => {
          randomize()
        }),
    [randomMode]
  )

  useObserve(
    () =>
      changes(breeds)
        .data.pipe(map((data) => (data ? Object.keys(data) : [])))
        .subscribe(changes(lists).primary),
    [breeds, lists]
  )

  useObserve(() => afterChanges(lists).primary.subscribe(() => randomize()), [lists])

  useObserve(
    () =>
      changes(terms)
        .primary.pipe(
          map((selected) =>
            selected && breeds.data?.[selected] ? breeds.data[selected] : []
          )
        )
        .subscribe(changes(lists).secondary),
    [terms, lists]
  )

  useObserve(() => {
    return changes(terms)
      .primary.pipe(filter((selected) => !!selected))
      .subscribe(() => {
        randomize(false)
      })
  }, [lists])

  return {
    terms,
    lists,
    randomize,
  }
}
