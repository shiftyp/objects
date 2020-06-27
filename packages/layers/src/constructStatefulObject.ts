import {
  Stateful,
  changeObservableSymbol,
  changedObservableSymbol,
} from '@objects/types';

import { ObservableLayer } from './observable';
import { createLayeredObjects } from './createLayeredObjects';
import { UpdateLayer } from './update';
import { ReflectionLayer } from './reflection';
import { ChangeObservableLayer } from './changeObservable';

export const constructStatefulObject = <Obj>(
  obj: Obj,
  update: () => void,
  onEnd: (cb: () => void) => void
) => () => {
  const changeObservableLayer = new ChangeObservableLayer(
    onEnd,
    changeObservableSymbol
  );
  const changedObservableLayer = new ChangeObservableLayer(
    onEnd,
    changedObservableSymbol
  );
  const observableLayer = new ObservableLayer(onEnd);
  const updateLayer = new UpdateLayer(update, onEnd);
  const reflectionLayer = new ReflectionLayer(onEnd);

  return createLayeredObjects(Object.assign({}, obj), [
    changeObservableLayer,
    observableLayer,
    reflectionLayer,
    changedObservableLayer,
    updateLayer,
  ]) as Stateful<Obj>;
};
