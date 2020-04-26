import { useForceUpdate } from './useForceUpdate';
import { HooksProxy } from './types';

export function useInstances<
  Obj extends Object,
  ConstructorArgs extends any[] = []
>(
  Constructor: {
    new (...args: ConstructorArgs): Obj;
  },
  rootInstance?: Obj
): (...args: ConstructorArgs) => HooksProxy<Obj> {
  function construct(...args: ConstructorArgs) {
    const instance = rootInstance || ({} as Obj);
    const createUpdatePromise = () =>
      new Promise<void>((resolve) => (resolveUpdatePromise = resolve));

    let resolveUpdatePromise: () => void;
    let updatePromise: Promise<void> = createUpdatePromise();

    const proxy = new Proxy<Obj>({} as Obj, {
      set: (_, prop, value) => {
        instance[prop as keyof Obj] = value;

        if (resolveUpdatePromise !== undefined) {
          resolveUpdatePromise();
          updatePromise = createUpdatePromise();
        }
        if (update !== undefined) {
          update();
        }
        return true;
      },
      get: (_, prop) => {
        if (prop === Symbol.asyncIterator) {
          return () => updateGenerator();
        }
        return instance[prop as keyof Obj];
      },
      ownKeys: () => {
        return Reflect.ownKeys(instance);
      },
    });

    const updateGenerator = async function* (): AsyncGenerator<Obj> {
      while (true) {
        await updatePromise;
        yield proxy;
      }
    };

    Object.setPrototypeOf(instance, Constructor.prototype);

    Constructor.apply(proxy, args);

    return proxy as HooksProxy<Obj>;
  }

  const [update] = useForceUpdate();

  return construct;
}
