import { useRef, useMemo } from 'react'
import { useInstances } from './useInstances'
import { useUpdate } from './useUpdate'
import { Stateful } from '@objects/types'
import { useReset } from './useReset'

export const useInstance = <Obj extends Object, Args extends any[] = []>(
  Constructor: {
    new (...args: Args): Obj
  },
  deps?: Stateful<{}>[],
  ...args: Args
): [Stateful<Obj>, () => void] => {
  const [reset, resets] = useUpdate()
  const instance = useRef<Obj>()

  useMemo(() => {
    instance.current = {} as Obj
  }, [resets])

  const [constructor, resetInstances] = useInstances(
    Constructor,
    deps,
    instance.current
  )

  const proxy = useMemo(() => constructor(...args) as Obj, [resets])

  useReset(reset, deps)

  return [
    proxy as Stateful<Obj>,
    () => {
      resetInstances()
      reset()
    },
  ]
}
