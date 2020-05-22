import { ObjectLayer } from '@objects/types';

export interface ReflectionLayer<Obj extends Object>
  extends Partial<ObjectLayer<Obj>> {}
export class ReflectionLayer<Obj extends Object> {
  ended = false;

  constructor(onEnd: (cb: () => void) => void) {
    onEnd(this.onEnd);

    [
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
    ].forEach((key) => {
      // @ts-ignore
      this[key] = (...args: any) => {
        if (this.ended) {
          throw new Error(
            'Attempted to reflect on an object instance after reset'
          );
        }
        if (key === 'set') {
          // Ignore the receiver prop for set calls
          // Fixes safari bug where properties are
          // redefined as readonly on re-set
          const [target, prop, value] = args;
          return Reflect[key](target, prop, value);
        }
        // @ts-ignore
        return Reflect[key](
          // @ts-ignore
          ...args
        );
      };
    });
  }

  onEnd = () => {
    this.ended = true;
  };
}
