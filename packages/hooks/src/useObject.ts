import { useRef, useMemo } from 'react'
import { useUpdate } from './useUpdate'
import { useObjects } from './useObjects'
import { Stateful } from '@objects/types'
import { useReset } from './useReset'

export const useObject = <Obj extends Object>(
  obj: Obj,
  deps?: Stateful<{}>[]
): [Stateful<Obj>, () => void] => {
  const instance = useRef<Obj>()
  const [reset, resets] = useUpdate()

  useMemo(() => {
    instance.current = obj
  }, [resets])

  const [constructor, resetInstance] = useObjects(instance.current!, deps)

  const proxy = useMemo(() => constructor(), [resets])

  useReset(reset, deps)

  return [
    proxy as Stateful<Obj>,
    () => {
      resetInstance()
      reset()
    },
  ]
}
