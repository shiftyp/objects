import { useObject, useObserve } from '@objects/hooks'
import { Stateful } from '@objects/types'

import { stream } from '@objects/operators'
import { map } from 'rxjs/operators'

export const useBreedCounts = (searches: Stateful<Record<string, string[]>>) => {
  const [counts, reset] = useObject<Record<string, number>>({}, [searches])

  useObserve(
    () =>
      stream(searches)
        .pipe(
          map((changes: Record<string, string[]>) => {
            const newCounts: Record<string, number | undefined> = {}

            for (const key of Object.keys(changes)) {
              const oldBreed = searches[key]?.join(' ')
              const newBreed = changes[key]?.join(' ')

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
