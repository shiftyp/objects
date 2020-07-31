import { ObjectLayer } from '@objects/types'

export interface ReflectionLayer<Obj extends Object>
  extends ObjectLayer<Obj> {}
export class ReflectionLayer<Obj extends Object> {
  static reflectMethods: (keyof typeof Reflect)[] = [
    'set',
    'get',
    'getOwnPropertyDescriptor',
    'getPrototypeOf',
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
  ]

  ended = false

  constructor(
    reflect: typeof Reflect,
    onEnd: (cb: () => void) => void
  ) {
    onEnd(this.onEnd)

    ReflectionLayer.reflectMethods.forEach(key => {
      // @ts-ignore
      this[key] = (...args: any) => {
        if (this.ended) {
          throw new Error(
            `Attempted to reflect.${key} after reset`
          )
        }
        if (key === 'set') {
          // Ignore the receiver prop for set calls
          // Fixes safari bug where properties are
          // redefined as readonly on re-set
          const [target, prop, value] = args
          return reflect[key](target, prop, value)
        }
        return reflect[key](
          // @ts-ignore
          ...args
        )
      }
    })
  }

  onEnd = () => {
    this.ended = true
  }
}
