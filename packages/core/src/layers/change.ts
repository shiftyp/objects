import { ObservableLayer } from './observable'
import {
  Changes,
  ChangeObservable,
  ChangeObserverArgs,
  ChangeObserver,
  ObjectObserver,
} from '@objects/types'

export class ChangeLayer<Obj> extends ObservableLayer<Obj> {
  constructor(onEnd: (cb: () => void) => void, symbol: Symbol) {
    super(onEnd, symbol)
  }

  protected static extractHandler = <
    Obj,
    Kind extends keyof ChangeObserver<Obj>
  >(
    [next, error, complete]: ChangeObserverArgs<Obj>,
    kind: Kind
  ): Kind extends 'next'
    ? (val: Obj[keyof Obj]) => void
    : Kind extends 'complete'
    ? () => void
    : Kind extends 'error'
    ? (e: any) => void
    : null => {
    if (kind === 'next') {
      // @ts-ignore
      return typeof next === 'function'
        ? next
        : next && typeof next.next === 'function'
        ? next.next.bind(next)
        : null
    } else if (kind === 'complete') {
      // @ts-ignore
      return typeof complete === 'function'
        ? complete
        : !!next &&
          typeof next === 'object' &&
          typeof next.complete === 'function'
        ? next.complete.bind(next)
        : null
    }

    // @ts-ignore
    return typeof error === 'function'
      ? error
      : !!next &&
        typeof next === 'object' &&
        typeof next.error === 'function'
      ? next.error.bind(next)
      : null
  }

  protected makeObservableMap = (receiver: Obj) => (
    makeObservable?: (subject: any) => any
  ): Changes<Obj> => {
    return new Proxy({} as Changes<Obj>, {
      get: <K extends keyof Obj>(_: any, prop: K) => {
        // @ts-ignore
        let ret: ChangeObservable<Obj, K> &
          ChangeObserver<
            Obj,
            K
          > = ObservableLayer.makeObservable(
          (...args: ChangeObserverArgs<Obj>) => {
            const observer: ChangeObserver<Obj> = {}

            for (const key of ['next', 'complete', 'error'] as [
              'next',
              'complete',
              'error'
            ]) {
              const handler = ChangeLayer.extractHandler(
                args,
                key
              )

              // @ts-ignore
              observer[key] = handler
            }

            const objectObserver: ObjectObserver<Obj> = {
              next: observer.next
                ? changes => {
                    if (Object(changes).hasOwnProperty(prop)) {
                      ChangeLayer.extractHandler(
                        args,
                        'next'
                      )?.(changes[prop])
                    }
                  }
                : null,
              complete: observer.complete
                ? () => {
                    ChangeLayer.extractHandler(
                      args,
                      'complete'
                    )?.()
                  }
                : null,
              error: observer.error
                ? (e: any) => {
                    ChangeLayer.extractHandler(
                      args,
                      'error'
                    )?.(e)
                  }
                : null,
            }

            return this.subscribe(objectObserver)
          }
        )

        if (typeof makeObservable === 'function') {
          ret = makeObservable(ret)
        }

        Object.assign(ret, {
          next: (value: Obj[K]) => {
            if (!this.ended) {
              receiver[prop] = value
            }
          },
        })

        return ret
      },
    })
  }

  get(target: Obj, prop: PropertyKey, reciever: Obj) {
    if (prop === this.symbol) {
      return this.makeObservableMap(reciever)
    }
  }
}
