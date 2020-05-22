import { useForceUpdate } from './useForceUpdate';
import {
  constructStatefulObject,
  ReflectionLayer,
} from '@objects/layers';
import { Stateful } from '@objects/types';
import { useRef, useMemo } from 'react';

export const useObjects = <Obj extends Object>(
  obj: Obj
): [() => Stateful<Obj>, () => void] => {
  const [update] = useForceUpdate();
  const resetHandlersRef = useRef<Set<() => void>>(
    useMemo(() => new Set(), [])
  );

  const reset = () => {
    resetHandlersRef.current.forEach((reset) => reset());
    resetHandlersRef.current.clear();
  };

  const addResetHandler = (handler: () => void) => {
    resetHandlersRef.current.add(handler);
  };

  const construct = constructStatefulObject(
    obj,
    update,
    addResetHandler
  );

  return [construct, reset];
};
