import { watch } from '@objects/operators';
import {
  fromEvent,
  from,
  animationFrameScheduler,
  Subscription,
  EMPTY,
} from 'rxjs';
import {
  map,
  filter,
  switchMap,
  takeUntil,
  throttleTime,
  startWith,
  delay,
  delayWhen,
} from 'rxjs/operators';
import {
  randomPosition,
  maxPosition,
  randomizePosition,
  translatePosition,
} from './utils';

import { Fish } from './Fish';
import { FishPosition, School } from './types';

export const flipping = (fish: Fish) => {
  const changes = watch(fish);

  return changes.position
    .pipe(map((position) => position.x >= fish.position.x))
    .subscribe(changes.flipped);
};

export const swimming = (fish: Fish) => {
  const changes = watch(fish);

  return fromEvent(window, 'resize')
    .pipe(
      startWith({}),
      switchMap(() =>
        from(
          fish.swimGenerator(maxPosition()),
          animationFrameScheduler
        )
      )
    )
    .pipe(
      filter((position) => position === 'rest'),
      map(() => randomPosition())
    )
    .subscribe(changes.target);
};

export const avoiding = (fish: Fish) => {
  const changes = watch(fish);

  return fromEvent(window, 'mousedown')
    .pipe(
      filter(
        (event) =>
          (event.target as HTMLElement).tagName.toLowerCase() !==
          'button'
      ),
      switchMap((startEvent) =>
        fromEvent(window, 'mousemove').pipe(
          startWith(startEvent),
          takeUntil(fromEvent(window, 'mouseup'))
        )
      )
    )
    .pipe(
      map(
        ({ clientX, clientY }: MouseEvent): FishPosition => ({
          x: clientX,
          y: clientY,
          z: 0,
        })
      ),
      map(fish.awayImpulse),
      map((impulse) => {
        return translatePosition(fish.position, impulse);
      })
    )
    .subscribe(changes.target);
};

export const following = (
  fish: Fish,
  parent?: Fish,
  school?: School
) => {
  if (parent && school) {
    const parentChanges = watch(parent);
    const fishChanges = watch(fish);

    return parentChanges.target
      .pipe(
        map((position) =>
          randomizePosition(position, school.size * 10)
        )
      )
      .subscribe(fishChanges.target);
  }
};
