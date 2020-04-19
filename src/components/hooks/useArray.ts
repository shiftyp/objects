import { useReducer, useRef, useMemo } from "react";

export const useArray = <Obj extends Array<any>>(
  obj: Obj
): [AsyncIterable<Obj> & Obj, () => void] => {
  const resetCopy = obj;
  const instance = useRef<Obj>(obj);
  const [state, update] = useReducer(() => instance.current.slice(), obj);
  const [resetCounter, reset] = useReducer(
    (updates) => (updates + 1) % Number.MAX_SAFE_INTEGER,
    0
  );

  const resetInstance = () => {
    instance.current = resetCopy;
    reset();
    update();
  };

  const proxy = useMemo(
    () =>
      new Proxy<Obj>(instance.current, {
        set: (_, prop, value) => {
          instance.current[prop as keyof Obj] = value;
          resolveUpdatePromise.current && resolveUpdatePromise.current();
          update();
          return true;
        },
        get: (_, prop) => {
          if (prop === Symbol.asyncIterator) {
            return () => updateGenerator;
          }
          if (
            typeof prop === "string" &&
            ["unshift", "push", "pop", "splice"].indexOf(prop) !== -1
          ) {
            return (...args: any[]) => {
              const ret = instance.current[prop](...args);
              update();
              return ret;
            };
          }
          if (typeof instance.current[prop] === "function") {
            return (...args: any[]) => instance.current[prop](...args);
          }

          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [instance.current, resetCounter]
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
