import { Stateful } from '@objects/types'
import { useEffect } from 'react'

export const useReset = (reset: () => void, deps?: Stateful<{}>[]) => {
  useEffect(() => {
    const subscriptions = deps?.map(
      (dep) =>
        dep &&
        dep[Symbol.observable]().subscribe({
          complete: reset,
        })
    )

    return () => {
      subscriptions?.forEach((sub) => sub.unsubscribe())
    }
  }, deps)
}
