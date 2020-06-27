import { ObservableLayer } from './observable';
import {
  changeObservableSymbol,
  ObjectObservableMap,
  ObjectObservable,
  ObjectObserverArgs,
  ChangeObservableMap,
  ChangeObservable,
  ChangeObserverArgs,
  ChangeObserver,
} from '@objects/types';

export class ChangeObservableLayer<Obj> extends ObservableLayer<Obj> {
  constructor(onEnd: (cb: () => void) => void, private symbol: Symbol) {
    super(onEnd);
  }
  makeObservableMap = (receiver: Obj) => (
    makeObservable?: (subject: any) => any
  ): ChangeObservableMap<Obj> => {
    return new Proxy({} as ChangeObservableMap<Obj>, {
      get: <K extends keyof Obj>(_: any, prop: K) => {
        // @ts-ignore
        let ret: ChangeObservable<Obj, K> &
          ChangeObserver<Obj, K> = ObservableLayer.makeObservable(
          (...[next, error, complete]: ChangeObserverArgs<Obj>) => {
            return this.subscribe({
              next: (changes) => {
                if (Object(changes).hasOwnProperty(prop)) {
                  typeof next === 'function'
                    ? next?.(changes[prop])
                    : next?.next?.(changes[prop]);
                }
              },
              complete: () => {
                typeof complete === 'function'
                  ? complete()
                  : typeof next !== 'function'
                  ? next?.complete?.()
                  : null;
              },
              error: (e: any) => {
                typeof error === 'function'
                  ? error(e)
                  : typeof next !== 'function'
                  ? next?.error?.(e)
                  : null;
              },
            });
          }
        );

        if (typeof makeObservable === 'function') {
          ret = makeObservable(ret);
        }

        Object.assign(ret, {
          next: (value: Obj[K]) => {
            if (!this.ended) {
              receiver[prop] = value;
            }
          },
        });

        return ret;
      },
    });
  };

  get(target: Obj, prop: PropertyKey, reciever: Obj) {
    if (prop === this.symbol) {
      return this.makeObservableMap(reciever);
    }
  }
}
