import { useRef, useMemo } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useObjects } from './useObjects';
import { useArrays } from './useArrays';
import { HooksProxy } from './types';

export const useObject = <Obj extends Object>(
  obj: Obj
): [HooksProxy<Obj>, () => void] => {
  const instance = useRef<Obj>();
  const [reset, resets] = useForceUpdate();

  useMemo(() => {
    instance.current = obj;
  }, [resets]);

  const constructor = useObjects(instance.current!);

  const proxy = useMemo(() => constructor(), [resets]);

  return [proxy as HooksProxy<Obj>, reset];
};
