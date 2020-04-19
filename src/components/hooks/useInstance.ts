import { useReducer, useRef, useMemo } from 'react';

export const useInstance = <Obj extends Object, Args extends any[] = []>(
  Constructor: {
    new (...args: Args): Obj;
  },
  ...args: Args
): [Obj & AsyncIterable<Obj>, () => void] => {
  const instance = useRef<Obj>({} as Obj);

  const [resetCounter, reset] = useReducer(
    (updates) => (updates + 1) % Number.MAX_SAFE_INTEGER,
    0
  );

  const resetInstance = () => {
    instance.current = {} as Obj;
    reset();
  };

  Object.setPrototypeOf(instance.current, Constructor.prototype);

  const proxy = useMemo(
    () =>
      new Proxy<Obj>({} as Obj, {
        set: (_, prop, value) => {
          instance.current[prop as keyof Obj] = value;
          if (
            resolveUpdatePromise !== undefined &&
            resolveUpdatePromise.current !== undefined
          ) {
            resolveUpdatePromise.current();
          }
          if (update !== undefined) {
            update();
          }
          return true;
        },
        get: (_, prop) => {
          if (prop === Symbol.asyncIterator) {
            return () => updateGenerator;
          }
          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [instance, resetCounter]
  );

  useMemo(() => Constructor.apply(proxy, args) as unknown, [
    Constructor,
    proxy,
    resetCounter,
  ]) as Obj;

  const [state, update] = useReducer(
    () => ({ ...instance.current }),
    instance.current
  );

  const resolveUpdatePromise = useRef<() => void>();
  const updatePromise = useRef<Promise<void>>();

  updatePromise.current = useMemo(
    () => new Promise((resolve) => (resolveUpdatePromise.current = resolve)),
    [state, resetCounter]
  );

  const updateGenerator = useMemo(
    async function* (): AsyncGenerator<Obj> {
      while (true) {
        await updatePromise.current;
        yield proxy;
      }
    },
    [resetCounter]
  );

  return [proxy as Obj & AsyncIterable<Obj>, resetInstance];
};
