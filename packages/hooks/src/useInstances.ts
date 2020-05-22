import { useForceUpdate } from './useForceUpdate';
import { Stateful } from '@objects/types';
import { useObjects } from './useObjects';

export function useInstances<
  Obj extends Object,
  ConstructorArgs extends any[] = []
>(
  Constructor: {
    new (...args: ConstructorArgs): Obj;
  },
  rootInstance?: Obj
): [(...args: ConstructorArgs) => Stateful<Obj>, () => void] {
  const [makeProxy, resetProxies] = useObjects(
    (rootInstance || {}) as Obj
  );

  function construct(...args: ConstructorArgs) {
    const proxy = makeProxy();

    Object.setPrototypeOf(proxy, Constructor.prototype);

    Constructor.apply(proxy, args);

    return proxy as Stateful<Obj>;
  }

  const [update] = useForceUpdate();

  return [construct, resetProxies];
}
