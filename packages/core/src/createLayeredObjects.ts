import { ObjectLayer } from '@objects/types'

export const createLayeredObjects = <Obj extends Object>(
  instance: Obj,
  layers: Partial<ObjectLayer<Obj>>[]
) =>
  new Proxy<Obj>(
    instance,
    ([
      'set',
      'get',
      'getOwnPropertyDescriptor',
      'set',
      'setPrototypeOf',
      'defineProperty',
      'deleteProperty',
      'enumerate',
      'isExtensible',
      'ownKeys',
      'apply',
      'construct',
      'has',
      'isExtensible',
      'preventExtensions',
    ] as (keyof ProxyHandler<Obj>)[]).reduce(
      (handler, key) => ({
        [key]: (...args: any[]) => {
          let ret = undefined

          for (const layer of layers) {
            const layerRet = layer[key]?.(
              // @ts-ignore
              ...args
            )
            if (layerRet !== undefined) {
              ret = layerRet
            }
          }

          return ret
        },
        ...handler,
      }),
      {}
    )
  )
