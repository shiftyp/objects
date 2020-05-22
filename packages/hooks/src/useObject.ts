import { useRef, useMemo } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useObjects } from './useObjects';
import { Stateful } from '@objects/types';

export const useObject = <Obj extends Object>(
  obj: Obj
): [Stateful<Obj>, () => void] => {
  const instance = useRef<Obj>();
  const [reset, resets] = useForceUpdate();

  useMemo(() => {
    instance.current = obj;
  }, [resets]);

  const [constructor, resetInstance] = useObjects(instance.current!);

  const proxy = useMemo(() => constructor(), [resets]);

  return [
    proxy as Stateful<Obj>,
    () => {
      resetInstance();
      reset();
    },
  ];
};
