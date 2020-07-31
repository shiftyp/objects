import { Stable, streamSymbol } from '@objects/types'
import { useEffect } from 'react'

export const useReset = (
  reset: () => void,
  deps?: Stable<{}>[]
) => {
  useEffect(() => {
    const subscriptions = deps?.map(
      dep =>
        dep &&
        dep[streamSymbol]().subscribe({
          complete: reset,
        })
    )

    return () => {
      subscriptions?.forEach(sub => sub && sub.unsubscribe())
    }
  }, deps)
}
