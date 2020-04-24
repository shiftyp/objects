import { useRef, useMemo } from 'react';
import { useInstances } from './useInstances';
import { useForceUpdate } from './useForceUpdate';
import { HooksProxy } from './types';

export const useInstance = <Obj extends Object, Args extends any[] = []>(
  Constructor: {
    new (...args: Args): Obj;
  },
  ...args: Args
): [HooksProxy<Obj>, () => void] => {
  const [reset, resets] = useForceUpdate();
  const instance = useRef<Obj>();

  useMemo(() => {
    instance.current = {} as Obj;
  }, [resets]);

  const constructor = useInstances(Constructor, instance.current);

  const proxy = useMemo(() => constructor(...args) as Obj, [resets]);

  return [proxy as HooksProxy<Obj>, reset];
};
