import Symbol_observable from 'symbol-observable'

export const changeObservableSymbol = Symbol('ChangeObservable')

export const changedObservableSymbol = Symbol('ChangedObservable')

export interface ObjectObserver<Obj, Key extends keyof Obj = keyof Obj> {
  next?: ((changes: Record<Key, Obj[Key]>) => void) | null
  error?: ((e: any) => void) | null
  complete?: (() => void) | null
}

export interface ChangeObserver<Obj, Key extends keyof Obj = keyof Obj> {
  next?: ((changes: Obj[Key]) => void) | null
  error?: ((e: any) => void) | null
  complete?: (() => void) | null
}

export type ObjectObserverArgs<Obj, Key extends keyof Obj = keyof Obj> =
  | [ObjectObserver<Obj, Key>?]
  | [
      ObjectObserver<Obj, Key>['next']?,
      ObjectObserver<Obj, Key>['error']?,
      ObjectObserver<Obj, Key>['complete']?
    ]

export type ChangeObserverArgs<Obj, Key extends keyof Obj = keyof Obj> =
  | [ChangeObserver<Obj, Key>?]
  | [
      ChangeObserver<Obj, Key>['next']?,
      ChangeObserver<Obj, Key>['error']?,
      ChangeObserver<Obj, Key>['complete']?
    ]

export type Subscription = { unsubscribe: () => void }

export interface ObjectObservable<Obj, Key extends keyof Obj = keyof Obj> {
  subscribe: (...args: ObjectObserverArgs<Obj, Key>) => Subscription
  [Symbol.observable](
    makeObservable?: (subject: any) => any
  ): ObjectObservable<Obj, Key>
}

export interface ChangeObservable<Obj, Key extends keyof Obj = keyof Obj> {
  subscribe: (...args: ChangeObserverArgs<Obj, Key>) => Subscription
  [Symbol.observable](
    makeObservable?: (subject: any) => any
  ): ChangeObservable<Obj, Key>
}

export type ObjectObservableMap<Obj> = {
  [K in keyof Obj]: ObjectObservable<Obj, K>
}

export type ChangeObservableMap<Obj> = {
  [K in keyof Obj]: ChangeObserver<Obj, K> & ChangeObservable<Obj, K>
}

export interface StatefulSymbols<Obj> {
  [Symbol.observable](makeObservable?: (subject: any) => any): ObjectObservable<Obj>
  [changeObservableSymbol](
    makeObservable?: (subject: any) => any
  ): ChangeObservableMap<Obj>
}

export type Stateful<Obj> = Obj & StatefulSymbols<Obj>

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
  set: (target: Obj, p: PropertyKey, value: any, receiver: any) => boolean | void
  deleteProperty: (target: Obj, p: PropertyKey) => boolean | void
  defineProperty: (
    target: Obj,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ) => boolean | void
  enumerate: (target: Obj) => PropertyKey[] | void
  ownKeys: (target: Obj) => PropertyKey[] | void
  apply: (target: Obj, thisArg: any, argArray?: any) => any | void
  construct: (target: Obj, argArray: any, newTarget?: any) => object | void
}
