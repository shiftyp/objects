import { changes, stream } from '@objects/operators'
import {
  fromEvent,
  from,
  animationFrameScheduler,
  interval,
  race,
  concat,
  Observable,
  of,
  Subscription,
  partition,
  generate,
  zip,
  combineLatest,
} from 'rxjs'
import {
  map,
  filter,
  switchMap,
  takeUntil,
  last,
  startWith,
  switchAll,
  skipUntil,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators'

import { name as fakeName } from 'faker'

import {
  randomPosition,
  maxPosition,
  randomizePosition,
  filterOutFishEvents,
  swimGenerator,
} from './utils'

import { Fish, FishPosition } from './types'
import { useObserve, useObjects } from '@objects/hooks'
import { Stable } from '@objects/types'

const feedObservable = race(
  fromEvent(window, 'touchstart'),
  fromEvent(window, 'mousedown')
).pipe(
  filter(filterOutFishEvents),
  map(startEvent =>
    fromEvent(
      window,
      startEvent.type === 'touchstart'
        ? 'touchmove'
        : 'mousemove'
    ).pipe(
      throttleTime(1000),
      startWith(startEvent),
      takeUntil(
        race(
          fromEvent(
            window,
            startEvent.type === 'touchstart'
              ? 'touchend'
              : 'mouseup'
          ),
          fromEvent(
            window,
            startEvent.type === 'touchstart'
              ? 'touchcancel'
              : 'mouseout'
          ).pipe(filter(filterOutFishEvents))
        )
      )
    )
  )
)

const resizeObservable = fromEvent(window, 'resize').pipe(
  startWith(new Event('initial'))
)

export const useSwimming = (fish: Stable<Fish>) =>
  useObserve(() => {
    const [swims, starts] = partition(
      resizeObservable.pipe(
        switchMap(() => {
          const max = maxPosition()

          return combineLatest(
            of(max),
            from(
              swimGenerator(fish, max),
              animationFrameScheduler
            )
          )
        })
      ),
      ([max, data]) => !!data
    )

    return new Subscription()
      .add(
        starts
          .pipe(map(([max]) => randomPosition(max)))
          .subscribe(changes(fish).target)
      )
      .add(
        swims
          .pipe(map(([max, data]) => data))
          .subscribe(stream(fish))
      )
  }, [fish])

const isTouchEvent = (
  e: MouseEvent | TouchEvent
): e is TouchEvent => e.hasOwnProperty('touches')

export const useFeeding = (fish: Stable<Fish>) =>
  useObserve(
    () =>
      feedObservable
        .pipe(
          switchAll(),
          map(
            (e: MouseEvent | TouchEvent): FishPosition =>
              isTouchEvent(e)
                ? {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    z: 0,
                  }
                : {
                    x: e.clientX,
                    y: e.clientY,
                    z: 0,
                  }
          ),
          map(position => randomizePosition(position, 500))
        )
        .subscribe(changes(fish).target),
    [fish]
  )

export const useFollowing = (
  fish: Stable<Fish>,
  parent?: Stable<Fish>
) =>
  useObserve(
    () =>
      parent &&
      concat(of(of(new Event('initial'))), feedObservable)
        .pipe(
          switchMap((feed: Observable<Event>) =>
            changes(parent).target.pipe(
              skipUntil(feed.pipe(last()))
            )
          ),
          map(position => randomizePosition(position, 400))
        )
        .subscribe(changes(fish).target),
    [fish, parent]
  )
