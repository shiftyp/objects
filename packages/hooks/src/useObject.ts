import { useRef, useMemo, MutableRefObject } from 'react'
import { useUpdate } from './useUpdate'
import { useObjects } from './useObjects'
import {
  Stable,
  ObjectOrInitalizer,
  ObjectInitializer,
} from '@objects/types'
import { useReset } from './useReset'

export const useObject = <Obj>(
  objOrInitializer: ObjectOrInitalizer<Obj>,
  deps?: Stable<{}>[],
  updateOrNull?: (() => void) | null
): [
  typeof objOrInitializer extends ObjectInitializer<Obj>
    ? ReturnType<typeof objOrInitializer>
    : typeof objOrInitializer extends Stable<Obj>
    ? Stable<Obj>
    : Stable<Obj>,
  () => void
] => {
  const [update] = updateOrNull === null ? [null] : useUpdate()

  const [constructor, resetInstances] = useObjects(
    objOrInitializer,
    deps,
    update
  )

  const [doRecreateInstance, recreateInstance] = useUpdate()

  const reset = () => {
    resetInstances()
    doRecreateInstance()
  }

  const instance = useMemo(() => constructor(), [
    recreateInstance,
  ])

  useReset(doRecreateInstance, deps)

  // @ts-ignore
  return [instance, reset]
}
