import { useRef, useMemo } from 'react'
import { Stateful, Subscription } from '@objects/types'
import { useEffect } from 'react'
import { useReset } from './useReset'
import { useUpdate } from './useUpdate'

export const useObserve = <Deps extends Stateful<{}>[]>(
  cb: (...deps: Partial<Deps>) => Subscription | undefined,
  deps: Deps
) => {
  let [reset, resets] = useUpdate()
  let subscription = useRef<Subscription | null>(null)

  useReset(reset, deps)

  useEffect(() => {
    subscription.current = cb(...deps) || null
    return () => {
      subscription.current?.unsubscribe()
    }
  }, [resets])
}
