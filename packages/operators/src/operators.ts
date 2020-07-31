import { from, Observable, Scheduler, NextObserver } from 'rxjs'

import {
  changeSymbol,
  changedSymbol,
  StableSymbols,
  ChangeObserver,
  streamedSymbol,
  streamSymbol,
} from '@objects/types'

type ChangeObserverRx<Obj, K extends keyof Obj> = ChangeObserver<
  Obj,
  K
> &
  NextObserver<Obj[K]>

type ChangeObservableMapRx<Obj> = {
  [K in keyof Obj]: ChangeObserverRx<Obj, K> & Observable<Obj[K]>
}

export const changes = <Obj>(
  obj: StableSymbols<Obj>,
  scheduler?: Scheduler
): ChangeObservableMapRx<Obj> => {
  // @ts-ignore
  return obj[changeSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export const afterChanges = <Obj>(
  obj: StableSymbols<Obj>,
  scheduler?: Scheduler
): ChangeObservableMapRx<Obj> => {
  // @ts-ignore
  return obj[changedSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export const stream = <Obj>(
  obj: StableSymbols<Obj>,
  scheduler?: Scheduler
): any => {
  return obj[streamSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export const afterStream = <Obj>(
  obj: StableSymbols<Obj>,
  scheduler?: Scheduler
): any => {
  return obj[streamedSymbol]((obs: any) =>
    scheduler ? from(obs, scheduler) : from(obs)
  )
}

export interface StatefulBase<Obj> extends StableSymbols<Obj> {}
export class StatefulBase<Obj> {}
