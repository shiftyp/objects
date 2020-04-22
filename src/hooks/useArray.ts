import { useRef, useMemo } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useArrays } from './useArrays';
import { HooksProxy } from './types';

export const useArray = <Obj extends Object>(
  obj: Array<Obj>
): [HooksProxy<Obj[]>, () => void] => {
  const instance = useRef<Array<Obj>>();
  const [reset, resets] = useForceUpdate();

  useMemo(() => {
    instance.current = obj;
  }, [resets]);

  const constructor = useArrays<Obj>(instance.current!);

  const proxy = useMemo(() => constructor(), [resets]);

  return [proxy as HooksProxy<Obj[]>, reset];
};
