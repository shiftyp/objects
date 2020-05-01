import { useForceUpdate } from './useForceUpdate';
import { HooksProxy } from './types';
import {
  unstable_trace as trace,
  unstable_wrap as wrap,
} from 'scheduler/tracing-profiling';
import { useRef } from 'react';

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
    const methodMap: WeakMap<Function, Function> = new WeakMap();

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
          trace(
            `${Constructor.name}.${String(prop)} = ${JSON.stringify(value)}`,
            performance.now(),
            update
          );
        }
        return true;
      },
      get: (_, prop) => {
        if (prop === Symbol.asyncIterator) {
          return () => updateGenerator();
        }

        const value = instance[prop as keyof Obj];

        if (typeof value === 'function') {
          if (!methodMap.get(value)) {
            methodMap.set(value, (...args: any[]) => {
              return trace(
                `${Constructor.name}.${String(prop)}(${args
                  .map((arg) => JSON.stringify(arg))
                  .join(', ')})`,
                performance.now(),
                () => {
                  return value.apply(proxy, args);
                }
              );
            });
          }
          return methodMap.get(value);
        }

        return value;
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
