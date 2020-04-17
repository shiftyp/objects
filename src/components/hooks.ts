import { useReducer, useRef, useMemo } from "react";

export const useObject = <Obj extends Object>(obj: Obj): Obj => {
  const instance = useRef<Obj>(obj);
  const [_, update] = useReducer(() => ({ ...instance.current }), obj);

  const proxy = new Proxy<Obj>({} as Obj, {
    set: (_, prop, value) => {
      instance.current[prop as keyof Obj] = value;
      update();
      return true;
    },
    get: (_, prop, reciever) => {
      return instance.current[prop as keyof Obj];
    },
    ownKeys: () => {
      return Reflect.ownKeys(instance.current);
    },
  });

  return proxy as Obj;
};

export const useClass = <Obj extends Object, Args extends any[] = []>(
  Constructor: {
    new (...args: Args): Obj;
  },
  ...args: Args
): Obj & AsyncIterable<Obj> => {
  const instance = useRef<Obj>({} as Obj);

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
        get: (_, prop, reciever) => {
          if (prop === Symbol.asyncIterator) {
            return () => updateGenerator;
          }
          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [instance]
  );

  useMemo(() => Constructor.apply(proxy, args) as unknown, [
    Constructor,
    proxy,
  ]) as Obj;

  const [state, update] = useReducer(
    () => ({ ...instance.current }),
    instance.current
  );

  const resolveUpdatePromise = useRef<() => void>();
  const updatePromise = useRef<Promise<void>>();

  updatePromise.current = useMemo(
    () => new Promise((resolve) => (resolveUpdatePromise.current = resolve)),
    [state]
  );

  const updateGenerator = useMemo(async function* (): AsyncGenerator<Obj> {
    while (true) {
      await updatePromise.current;
      yield proxy;
    }
  }, []);

  return proxy as Obj & AsyncIterable<Obj>;
};
