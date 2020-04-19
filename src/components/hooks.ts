import { useReducer, useRef, useMemo } from "react";

export const useObject = <Obj extends Object>(
  obj: Obj
): [AsyncIterable<Obj> & Obj, () => void] => {
  const resetCopy = obj;
  const instance = useRef<Obj>(obj);
  const [state, update] = useReducer(() => ({ ...instance.current }), obj);
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
      new Proxy<Obj>({} as Obj, {
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
          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [resetCounter]
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
      new Proxy<Obj>({} as Obj, {
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
          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [resetCounter]
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

export const useClass = <Obj extends Object, Args extends any[] = []>(
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

export function useClasses<
  Obj extends Object,
  ConstructorArgs extends any[] = []
>(Constructor: {
  new (...args: ConstructorArgs): Obj;
}): (...args: ConstructorArgs) => Obj & AsyncIterable<Obj> {
  function construct(...args: ConstructorArgs) {
    const instance = {} as Obj;
    const createUpdatePromise = () =>
      new Promise<void>((resolve) => (resolveUpdatePromise = resolve));

    let resolveUpdatePromise: () => void;
    let updatePromise: Promise<void> = createUpdatePromise();

    const proxy = new Proxy<Obj>({} as Obj, {
      set: (_, prop, value) => {
        instance[prop as keyof Obj] = value;

        if (resolveUpdatePromise !== undefined) {
          updatePromise = createUpdatePromise();
          resolveUpdatePromise();
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
        return instance[prop as keyof Obj];
      },
      ownKeys: () => {
        return Reflect.ownKeys(instance);
      },
    });

    const updateGenerator = (async function* (): AsyncGenerator<Obj> {
      while (true) {
        await updatePromise;
        yield proxy;
      }
    })();

    Object.setPrototypeOf(instance, Constructor.prototype);

    Constructor.apply(proxy, args);

    return proxy as Obj & AsyncIterable<Obj>;
  }

  const [_, update] = useReducer(
    (updates) => (updates + 1) % Number.MAX_SAFE_INTEGER,
    0
  );

  return construct;
}
