import { Stateful } from '@objects/types'
import { useObserve, useObject } from '@objects/hooks'
import { changes } from '@objects/operators'
import { map } from 'rxjs/operators'
import { Mode } from '../logic/Mode'

interface Selection {
  terms: string[]
  id: string
}

export const useGameSelection = (selectionMode: Stateful<Mode>) => {
  const [selection, resetSelection] = useObject({
    dog: null as Selection | null,
  })

  useObserve(
    () =>
      changes(selection)
        .dog.pipe(map((dog) => !!dog && !!dog.terms.length))
        .subscribe(changes(selectionMode).value),
    [selection, selectionMode]
  )

  return {
    selection,
    reset: resetSelection,
  }
}
