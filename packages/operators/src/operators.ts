import { from, Observable, Scheduler, Subscription } from 'rxjs';

import {
  changeObservableMapSymbol,
  StatefulSymbols,
  ChangeObservableMap,
  ChangeObserver,
} from '@objects/types';

type ChangeObservableMapRx<Obj> = {
  [K in keyof Obj]: ChangeObserver<Obj, K> & Observable<Obj[K]>;
};

export const watch = <Obj>(
  obj: StatefulSymbols<Obj>,
  scheduler?: Scheduler
): ChangeObservableMapRx<Obj> => {
  // @ts-ignore
  return obj[changeObservableMapSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  );
};

export interface StatefulBase<Obj> extends StatefulSymbols<Obj> {}
export class StatefulBase<Obj> {}
