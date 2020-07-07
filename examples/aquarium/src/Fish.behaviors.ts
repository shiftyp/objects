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
} from 'rxjs/operators'
import {
  randomPosition,
  maxPosition,
  randomizePosition,
  translatePosition,
} from './utils'

import { Fish } from './Fish.logic'
import { FishPosition, School } from './types'

const randomizeBasedOnSchoolSize = (school?: School, scale: number = 200) => (
  position: FishPosition
) => randomizePosition(position, school ? school.size * scale : 0)

const filterOutFishEvents = (event: MouseEvent) => {
  const targets = [event.target as HTMLElement, event.relatedTarget as HTMLElement]
  for (const element of targets) {
    if (
      element &&
      (element.tagName.toLowerCase() === 'button' ||
        element.parentElement?.tagName.toLowerCase() === 'button')
    ) {
      return false
    }
  }
  return true
}

const feedObservable = fromEvent(window, 'mousedown').pipe(
  filter(filterOutFishEvents),
  map((startEvent) =>
    fromEvent(window, 'mousemove').pipe(
      startWith(startEvent),
      throttleTime(500),
      switchMap((event) =>
        interval(1000).pipe(
          map(() => event),
          startWith(event)
        )
      ),
      takeUntil(
        race(
          fromEvent(window, 'mouseup'),
          fromEvent(window, 'mouseout').pipe(filter(filterOutFishEvents))
        )
      )
    )
  )
)

export const swimming = (fish: Fish) => {
  const swims = fromEvent(window, 'resize').pipe(
    startWith(new Event('initial')),
    tap(() => console.log(fish.name, 'swimming')),
    switchMap(() => from(fish.swimGenerator(maxPosition()), animationFrameScheduler))
  )
  return new Subscription()
    .add(
      swims
        .pipe(
          filter((data) => !data),
          map(() => randomPosition()),
          tap(() => console.log(fish.name, 'distracted'))
        )
        .subscribe(changes(fish).target)
    )
    .add(swims.pipe(filter((data) => !!data)).subscribe(stream(fish)))
}

export const feeding = (fish: Fish, school?: School) =>
  feedObservable
    .pipe(
      switchAll(),
      map(
        ({ clientX, clientY }: MouseEvent): FishPosition => ({
          x: clientX,
          y: clientY,
          z: 0,
        })
      ),
      map((position) => fish.towardsImpulse(position)),
      map((impulse) => {
        return translatePosition(fish.position, impulse)
      }),
      map(randomizeBasedOnSchoolSize(school, 50)),
      tap(() => console.log(fish.name, 'feeding'))
    )
    .subscribe(changes(fish).target)

export const following = (fish: Fish, parent?: Fish, school?: School) =>
  parent &&
  school &&
  concat(of(of(new Event('initial'))), feedObservable)
    .pipe(
      switchMap((feed: Observable<Event>) =>
        changes(parent).target.pipe(
          skipUntil(feed.pipe(last())),
          map(randomizeBasedOnSchoolSize(school))
        )
      ),
      tap(() => console.log(fish.name, 'following', parent.name))
    )
    .subscribe(changes(fish).target)
