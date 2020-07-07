import { useCallback, useEffect } from 'react'
import { useInstance, useObserve, useObject } from '@objects/hooks'
import { Stateful } from '@objects/types'
import { changes, afterChanges } from '@objects/operators'
import { map, take, filter } from 'rxjs/operators'

import { BreedTerms } from '../logic/BreedTerms'
import { BreedsCollection } from '../logic/BreedsCollection'
import { Mode } from '../logic/Mode'

export const useSearchTerms = (
  breeds: Stateful<BreedsCollection>,
  randomMode: Stateful<Mode>
) => {
  const [terms, resetTerms] = useInstance(BreedTerms)
  const [lists, resetLists] = useObject({
    primaryList: [] as string[],
    secondaryList: [] as string[],
  })

  const reset = () => {
    resetTerms()
    resetLists()
  }

  const randomize = useCallback(
    (primary: boolean = true, secondary: boolean = true) => {
      const selectRandom = (arr: string[]) => {
        return arr[Math.floor(Math.random() * arr.length)]
      }
      if (primary) {
        terms.selected = selectRandom(lists.primaryList)
      }
      if (secondary) {
        terms.secondarySelected = selectRandom(lists.secondaryList)
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
        .subscribe(changes(lists).primaryList),
    [breeds, lists]
  )

  useObserve(() => afterChanges(lists).primaryList.subscribe(() => randomize()), [
    lists,
  ])

  useObserve(
    () =>
      changes(terms)
        .selected.pipe(
          map((selected) =>
            selected && breeds.data?.[selected] ? breeds.data[selected] : []
          )
        )
        .subscribe(changes(lists).secondaryList),
    [terms, lists]
  )

  useObserve(() => {
    return changes(terms)
      .selected.pipe(filter((selected) => !!selected))
      .subscribe(() => {
        randomize(false)
      })
  }, [lists])

  return {
    terms,
    lists,
    randomize,
    reset,
  }
}
