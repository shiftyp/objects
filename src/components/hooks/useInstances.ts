import { useReducer } from "react";

export function useInstances<
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
