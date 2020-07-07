import { useUpdate } from './useUpdate'
import { constructStatefulObject } from '@objects/core'
import { Stateful } from '@objects/types'
import { useRef, useMemo, useEffect } from 'react'
import { useReset } from './useReset'

export const useObjects = <Obj extends Object>(
  obj: Obj,
  deps?: Stateful<{}>[]
): [() => Stateful<Obj>, () => void] => {
  const [update] = useUpdate()
  const resetHandlersRef = useRef<Set<() => void>>(useMemo(() => new Set(), []))

  const reset = () => {
    resetHandlersRef.current.forEach((reset) => reset())
    resetHandlersRef.current.clear()
  }

  const addResetHandler = (handler: () => void) => {
    resetHandlersRef.current.add(handler)
  }

  const construct = constructStatefulObject(obj, update, addResetHandler)

  useReset(reset, deps)

  return [construct, reset]
}
