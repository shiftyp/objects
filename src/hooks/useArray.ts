import { useRef, useMemo } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useArrays } from './useArrays';
import { HooksProxy } from './types';

export const useArray = <Obj extends Object>(
  obj: Array<Obj>
): [HooksProxy<Obj[]>, () => void] => {
  const resetCopy = obj;
  const instance = useRef<Array<Obj>>(obj);
  const update = useForceUpdate();

  const resetInstance = () => {
    instance.current = resetCopy;
    update();
  };

  const constructor = useArrays<Obj>(instance.current);

  const proxy = useMemo(() => constructor(), [instance.current]);

  return [proxy as HooksProxy<Obj[]>, resetInstance];
};
