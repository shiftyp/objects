import { useUpdate } from './useUpdate'
import { Stateful } from '@objects/types'
import { useObjects } from './useObjects'
import { useReset } from './useReset'

export function useInstances<Obj extends Object, ConstructorArgs extends any[] = []>(
  Constructor: {
    new (...args: ConstructorArgs): Obj
  },
  deps?: Stateful<{}>[],
  rootInstance?: Obj
): [(...args: ConstructorArgs) => Stateful<Obj>, () => void] {
  const [makeProxy, resetProxies] = useObjects((rootInstance || {}) as Obj, deps)

  function construct(...args: ConstructorArgs) {
    const proxy = makeProxy()

    Object.setPrototypeOf(proxy, Constructor.prototype)

    Constructor.apply(proxy, args)

    return proxy as Stateful<Obj>
  }

  return [construct, resetProxies]
}
