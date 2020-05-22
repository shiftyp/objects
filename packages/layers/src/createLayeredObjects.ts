import { ObjectLayer } from '@objects/types';

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
          for (const layer of layers) {
            const ret = layer[key]?.(
              // @ts-ignore
              ...args
            );
            if (ret !== undefined) {
              return ret;
            }
          }
        },
        ...handler,
      }),
      {}
    )
  );
