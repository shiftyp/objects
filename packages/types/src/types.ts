import 'symbol-observable'

export const streamSymbol = Symbol('stream')

export const changeSymbol = Symbol('change')

export const changedSymbol = Symbol('changed')

export const streamedSymbol = Symbol('streamed')

export interface ObjectObserver<
  Obj,
  Key extends keyof Obj = keyof Obj
> {
  next?: ((changes: Record<Key, Obj[Key]>) => void) | null
  error?: ((e: any) => void) | null
  complete?: (() => void) | null
}

export interface ChangeObserver<
  Obj,
  Key extends keyof Obj = keyof Obj
> {
  next?: ((changes: Obj[Key]) => void) | null
  error?: ((e: any) => void) | null
  complete?: (() => void) | null
}

export type ObjectObserverArgs<
  Obj,
  Key extends keyof Obj = keyof Obj
> =
  | [ObjectObserver<Obj, Key>?]
  | [
      ObjectObserver<Obj, Key>['next']?,
      ObjectObserver<Obj, Key>['error']?,
      ObjectObserver<Obj, Key>['complete']?
    ]

export type ChangeObserverArgs<
  Obj,
  Key extends keyof Obj = keyof Obj
> =
  | [ChangeObserver<Obj, Key>?]
  | [
      ChangeObserver<Obj, Key>['next']?,
      ChangeObserver<Obj, Key>['error']?,
      ChangeObserver<Obj, Key>['complete']?
    ]

export type Subscription = { unsubscribe: () => void }

export interface ObjectObservable<
  Obj,
  Key extends keyof Obj = keyof Obj
> {
  subscribe: (
    ...args: ObjectObserverArgs<Obj, Key>
  ) => Subscription
  [Symbol.observable](
    makeObservable?: (subject: any) => any
  ): ObjectObservable<Obj, Key>
}

export interface ChangeObservable<
  Obj,
  Key extends keyof Obj = keyof Obj
> {
  subscribe: (
    ...args: ChangeObserverArgs<Obj, Key>
  ) => Subscription
  [Symbol.observable](
    makeObservable?: (subject: any) => any
  ): ChangeObservable<Obj, Key>
}

export type Changes<Obj> = {
  [K in keyof Obj]: ChangeObserver<Obj, K> &
    ChangeObservable<Obj, K>
}

export interface StableSymbols<Obj> {
  [streamSymbol](
    makeObservable?: (subject: any) => any
  ): ObjectObservable<Obj>
  [streamedSymbol](
    makeObservable?: (subject: any) => any
  ): ObjectObservable<Obj>
  [changeSymbol](
    makeObservable?: (subject: any) => any
  ): Changes<Obj>
  [changedSymbol](
    makeObservable?: (subject: any) => any
  ): Changes<Obj>
}

export type Stable<Obj> = Obj & StableSymbols<Obj>

export interface LayerContext {
  stopLayerPropagation: () => {}
}

export interface ObjectLayer<Obj extends Object> {
  getPrototypeOf: (target: Obj) => Obj | null | void
  setPrototypeOf: (target: Obj, v: any) => boolean | void
  isExtensible: (target: Obj) => boolean | void
  preventExtensions: (target: Obj) => boolean | void
  getOwnPropertyDescriptor: (
    target: Obj,
    p: PropertyKey
  ) => PropertyDescriptor | void
  has: (target: Obj, p: PropertyKey) => boolean | void
  get: (target: Obj, p: PropertyKey, receiver: any) => any | void
  set: (
    target: Obj,
    p: PropertyKey,
    value: any,
    receiver: any
  ) => boolean | void
  deleteProperty: (target: Obj, p: PropertyKey) => boolean | void
  defineProperty: (
    target: Obj,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ) => boolean | void
  enumerate: (target: Obj) => PropertyKey[] | void
  ownKeys: (target: Obj) => PropertyKey[] | void
  apply: (
    target: Obj,
    thisArg: any,
    argArray?: any
  ) => any | void
  construct: (
    target: Obj,
    argArray: any,
    newTarget?: any
  ) => object | void
}

export type Stabilize = <Other>(
  other: ObjectOrInitalizer<Other>
) => typeof other extends ObjectInitializer<Other>
  ? ReturnType<typeof other>
  : Stable<Other>

export type ObjectInitializer<Obj> = (
  stablilize?: Stabilize
) => Obj | Stable<Obj>

export type ObjectOrInitalizer<Obj> =
  | Obj
  | ObjectInitializer<Obj>
  | Stable<Obj>
