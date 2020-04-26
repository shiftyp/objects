import { useForceUpdate } from './useForceUpdate';
import { HooksProxy } from './types';

export const useObjects = <Obj extends Object>(
  obj: Obj
): (() => HooksProxy<Obj>) => {
  const [update] = useForceUpdate();

  const construct = () => {
    const proxy = new Proxy<Obj>(Object.assign({}, obj), {
      set: (instance, prop, value) => {
        instance[prop as keyof Obj] = value;
        updatePromise = new Promise(
          (resolve) => (resolveUpdatePromise = resolve)
        );
        resolveUpdatePromise && resolveUpdatePromise();
        update();
        return true;
      },
      get: (instance, prop) => {
        if (prop === Symbol.asyncIterator) {
          return () => updateGenerator();
        }
        return instance[prop as keyof Obj];
      },
      ownKeys: (instance) => {
        return Reflect.ownKeys(instance);
      },
      deleteProperty: (instance, prop) => {
        delete instance[prop as keyof Obj];
        return true;
      },
    });

    let resolveUpdatePromise: (() => void) | null = null;
    let updatePromise: Promise<void> | null = null;

    const updateGenerator = async function* (): AsyncGenerator<Obj> {
      while (true) {
        await updatePromise;
        yield proxy;
      }
    };

    return proxy as HooksProxy<Obj>;
  };

  return construct;
};
