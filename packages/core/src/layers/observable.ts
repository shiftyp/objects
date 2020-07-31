import {
  ObjectLayer,
  ObjectObserver,
  ObjectObserverArgs,
} from '@objects/types'

export class ObservableLayer<Obj extends Object>
  implements
    Pick<ObjectLayer<Obj>, 'set' | 'get' | 'deleteProperty'> {
  protected observers = new Set<ObjectObserver<Obj>>()
  protected ended = false

  constructor(
    onEnd: (cb: () => void) => void,
    protected symbol: Symbol
  ) {
    onEnd(this.onEnd)
  }

  private onEnd = () => {
    this.ended = true
    this.observers.forEach(observer => observer.complete?.())
    this.observers.clear()
  }

  protected subscribe = (
    ...[next, error, complete]: ObjectObserverArgs<Obj>
  ) => {
    let observer: ObjectObserver<Obj>

    if (next !== null && typeof next !== 'function') {
      observer = next as ObjectObserver<Obj>
    } else {
      observer = {
        next: next as ObjectObserver<Obj>['next'],
        error,
        complete,
      }
    }
    this.observers.add(observer)
    return { unsubscribe: () => this.observers.delete(observer) }
  }

  protected static makeObservable = <Obj extends Object>(
    subscribe: ObservableLayer<Obj>['subscribe']
  ) => ({
    subscribe: subscribe,
    [Symbol.observable]: () =>
      ObservableLayer.makeObservable(subscribe),
  })

  protected runObservers(
    prop: keyof Obj,
    value: any,
    instance: Obj
  ) {
    this.observers.forEach(observer =>
      observer.next?.({ [prop as keyof Obj]: value } as Record<
        keyof Obj,
        Obj[keyof Obj]
      >)
    )
  }

  set(instance: Obj, prop: PropertyKey, value: any) {
    if (!this.ended) {
      this.runObservers(prop as keyof Obj, value, instance)
    }
  }

  get(_: Obj, prop: PropertyKey, receiver: any): any {
    if (prop === this.symbol) {
      return (makeObservable?: (subject: any) => any) => {
        let base = ObservableLayer.makeObservable(this.subscribe)

        if (makeObservable) {
          base = makeObservable(base)
        }

        return Object.assign(base, {
          next: (changes: Partial<Obj>) => {
            if (!this.ended) {
              for (const key of Object.keys(
                changes
              ) as (keyof Obj)[]) {
                receiver[key] = changes[key]
              }
            }
          },
        })
      }
    }
  }

  deleteProperty(instance: Obj, prop: PropertyKey) {
    if (!this.ended) {
      this.runObservers(prop as keyof Obj, undefined, instance)
    }
  }
}
