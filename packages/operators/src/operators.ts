import { from, Observable, Scheduler, NextObserver } from 'rxjs'

import {
  changeObservableSymbol,
  changedObservableSymbol,
  StatefulSymbols,
  ChangeObserver,
} from '@objects/types'

type ChangeObserverRx<Obj, K extends keyof Obj> = ChangeObserver<Obj, K> &
  NextObserver<Obj[K]>

type ChangeObservableMapRx<Obj> = {
  [K in keyof Obj]: ChangeObserverRx<Obj, K> & Observable<Obj[K]>
}

export const changes = <Obj>(
  obj: StatefulSymbols<Obj>,
  scheduler?: Scheduler
): ChangeObservableMapRx<Obj> => {
  // @ts-ignore
  return obj[changeObservableSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export const afterChanges = <Obj>(
  obj: StatefulSymbols<Obj>,
  scheduler?: Scheduler
): ChangeObservableMapRx<Obj> => {
  // @ts-ignore
  return obj[changedObservableSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export const stream = <Obj>(
  obj: StatefulSymbols<Obj>,
  scheduler?: Scheduler
): any => {
  return obj[Symbol.observable]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export interface StatefulBase<Obj> extends StatefulSymbols<Obj> {}
export class StatefulBase<Obj> {}
