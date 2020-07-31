import {
  ObjectLayer,
  Stable,
  changeSymbol,
  changedSymbol,
  streamedSymbol,
  streamSymbol,
  ObjectOrInitalizer,
  ObjectInitializer,
  Stabilize,
} from '@objects/types'

import { ObservableLayer } from './layers/observable'
import { UpdateLayer } from './layers/update'
import { ReflectionLayer } from './layers/reflection'
import { ChangeLayer } from './layers/change'

import { createLayeredObjects } from './createLayeredObjects'
import { ConnectionLayer } from './layers/connection'

export const constructStatefulObject = <Obj>(
  obj: ObjectOrInitalizer<Obj>,
  reset: () => void,
  onEnd: (cb: () => void) => void,
  update?: () => void
) => {
  const construct = <Other>(
    root?: ObjectOrInitalizer<Other>
  ) => (override?: ObjectOrInitalizer<Other>) => {
    if (!root && !override) {
      throw new TypeError('Target is undefined')
    }

    const targetBase = (override || root) as
      | Other
      | ObjectOrInitalizer<Other>

    if (typeof targetBase === 'function') {
      const target = (targetBase as ObjectInitializer<
        Other
      >)((obj => construct(obj)()) as Stabilize)

      return target
    } else {
      const target = targetBase as Stable<Other> | Other
      const layers = [
        new ChangeLayer(onEnd, changeSymbol),
        new ObservableLayer(onEnd, streamSymbol),
        new ReflectionLayer(Reflect, onEnd),
        new ObservableLayer(onEnd, streamedSymbol),
        new ChangeLayer(onEnd, changedSymbol),
        ConnectionLayer.isConnectable(target)
          ? new ConnectionLayer(target, reset, onEnd, update)
          : new UpdateLayer(onEnd, update),
      ] as Partial<ObjectLayer<Other>>[]

      const receiver = createLayeredObjects(
        target,
        layers
      ) as Stable<Other>

      return receiver
    }
  }

  return construct(obj)
}
