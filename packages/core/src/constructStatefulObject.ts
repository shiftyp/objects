import {
  Stateful,
  changeObservableSymbol,
  changedObservableSymbol,
} from '@objects/types'

import { ObservableLayer } from './layers/observable'
import { UpdateLayer } from './layers/update'
import { ReflectionLayer } from './layers/reflection'
import { ChangeObservableLayer } from './layers/changeObservable'

import { createLayeredObjects } from './createLayeredObjects'

export const constructStatefulObject = <Obj>(
  obj: Obj,
  update: () => void,
  onEnd: (cb: () => void) => void
) => () => {
  const changeObservableLayer = new ChangeObservableLayer(
    onEnd,
    changeObservableSymbol
  )
  const changedObservableLayer = new ChangeObservableLayer(
    onEnd,
    changedObservableSymbol
  )
  const observableLayer = new ObservableLayer(onEnd)
  const updateLayer = new UpdateLayer(update, onEnd)
  const reflectionLayer = new ReflectionLayer(Reflect, onEnd)

  return createLayeredObjects(Object.assign({}, obj), [
    changeObservableLayer,
    observableLayer,
    reflectionLayer,
    changedObservableLayer,
    updateLayer,
  ]) as Stateful<Obj>
}
