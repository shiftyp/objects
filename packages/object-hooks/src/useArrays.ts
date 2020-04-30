import { useForceUpdate } from './useForceUpdate';
import { HooksProxy } from './types';

export const useArrays = <Obj>(obj: Array<Obj>): (() => HooksProxy<Obj[]>) => {
  const [update] = useForceUpdate();

  const construct = () => {
    const createUpdatePromise = () =>
      new Promise<void>((resolve) => (resolveUpdatePromise = resolve));

    const proxy = new Proxy<Array<Obj>>([...obj], {
      set: (instance, prop, value) => {
        instance[prop as any] = value;
        resolveUpdatePromise && resolveUpdatePromise();
        updatePromise = createUpdatePromise();
        update();
        return true;
      },
      get: (instance, prop) => {
        if (prop === Symbol.asyncIterator) {
          return () => updateGenerator();
        }
        if (
          typeof prop === 'string' &&
          ['unshift', 'push', 'pop', 'splice'].indexOf(prop) !== -1
        ) {
          return (...args: any[]) => {
            const ret = instance[prop](...args);
            resolveUpdatePromise && resolveUpdatePromise();
            updatePromise = createUpdatePromise();
            update();
            return ret;
          };
        }
        if (typeof instance[prop] === 'function') {
          return (...args: any[]) => instance[prop](...args);
        }

        return instance[prop as any];
      },
      ownKeys: (instance) => {
        return Reflect.ownKeys(instance);
      },
      deleteProperty: (instance, prop) => {
        return Reflect.deleteProperty(instance, prop);
      },
    });

    let resolveUpdatePromise: (() => void) | null = null;
    let updatePromise: Promise<void> = createUpdatePromise();

    const updateGenerator = async function* (): AsyncGenerator<Array<Obj>> {
      while (true) {
        await updatePromise;
        yield proxy;
      }
    };

    return proxy as HooksProxy<Obj[]>;
  };

  return construct;
};
