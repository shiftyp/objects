import { useObject, useObserve } from '@objects/hooks'
import { Stateful } from '@objects/types'

import { stream } from '@objects/operators'
import { map } from 'rxjs/operators'
import { toBreed } from '../utils'
import { SearchIndex, BreedCounts } from '../types'

export const useBreedCounts = (searches: Stateful<SearchIndex>) => {
  const [counts, reset] = useObject<BreedCounts>({}, [searches])

  useObserve(
    () =>
      stream(searches)
        .pipe(
          map((changes: Record<string, string[]>) => {
            const newCounts: Record<string, number | undefined> = {}

            for (const key of Object.keys(changes)) {
              const oldBreed = toBreed(searches[key])
              const newBreed = toBreed(changes[key])

              if (oldBreed === undefined && newBreed) {
                newCounts[newBreed] = (counts[newBreed] || 0) + 1
              } else if (oldBreed && newBreed === undefined) {
                newCounts[oldBreed] = (counts[oldBreed] || 1) - 1

                if (!newCounts[newBreed]) {
                  newCounts[oldBreed] = undefined
                }
              }
            }

            return newCounts
          })
        )
        .subscribe(stream(counts)),
    [searches]
  )

  return { counts, reset }
}
