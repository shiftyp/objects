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
  const instance = useRef<Obj>({} as Obj);
  const update = useForceUpdate();

  const constructor = useInstances(Constructor, instance.current);

  const proxy = useMemo(() => constructor(...args) as Obj, [instance.current]);

  const resetInstance = () => {
    instance.current = {} as Obj;
    update;
  };

  return [proxy as HooksProxy<Obj>, resetInstance];
};
