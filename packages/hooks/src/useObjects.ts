import { useUpdate } from './useUpdate'
import { constructStatefulObject } from '@objects/core'
import {
  Stable,
  ObjectOrInitalizer,
  ObjectInitializer,
} from '@objects/types'
import { useRef, useMemo, useEffect } from 'react'
import { useReset } from './useReset'

export const useObjects = <Obj>(
  objOrInitializer: ObjectOrInitalizer<Obj>,
  deps?: Stable<{}>[],
  updateOrNull?: (() => void) | null
): [
  (
    override?: ObjectOrInitalizer<Obj>
  ) => typeof objOrInitializer extends ObjectInitializer<Obj>
    ? ReturnType<typeof objOrInitializer>
    : typeof objOrInitializer extends Stable<Obj>
    ? Stable<Obj>
    : Stable<Obj>,
  () => void
] => {
  const [update] =
    updateOrNull === undefined || updateOrNull === null
      ? useUpdate()
      : [updateOrNull]

  const resetHandlersRef = useRef<Set<() => void>>(
    useMemo(() => new Set(), [])
  )

  const reset = () => {
    resetHandlersRef.current.forEach(reset => reset())
    resetHandlersRef.current.clear()
  }

  const addResetHandler = (handler: () => void) => {
    resetHandlersRef.current.add(handler)
  }

  const construct = constructStatefulObject(
    objOrInitializer,
    reset,
    addResetHandler,
    update
  )

  useReset(reset, deps)

  // @ts-ignore
  return [construct, reset]
}
