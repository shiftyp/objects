import { useRef, useMemo } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useObjects } from './useObjects';
import { useArrays } from './useArrays';
import { HooksProxy } from './types';

export const useObject = <Obj extends Object>(
  obj: Obj
): [HooksProxy<Obj>, () => void] => {
  const resetCopy = obj;
  const instance = useRef<Obj>(obj);
  const update = useForceUpdate();

  const resetInstance = () => {
    instance.current = resetCopy;
    update();
  };

  const constructor = Array.isArray(instance.current)
    ? useArrays(instance.current)
    : useObjects(instance.current);

  const proxy = useMemo(() => constructor(), [instance.current]);

  return [proxy as HooksProxy<Obj>, resetInstance];
};
