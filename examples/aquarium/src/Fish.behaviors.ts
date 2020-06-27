import { changes } from '@objects/operators';
import { fromEvent, from, animationFrameScheduler, interval, race } from 'rxjs';
import {
  map,
  filter,
  switchMap,
  takeUntil,
  throttleTime,
  startWith,
} from 'rxjs/operators';
import {
  randomPosition,
  maxPosition,
  randomizePosition,
  translatePosition,
} from './utils';

// TODO: Split into separate files

import { Fish } from './Fish';
import { FishPosition, School } from './types';

export const flipping = (fish: Fish) =>
  changes(fish)
    .position.pipe(map((position) => position.x >= fish.position.x))
    .subscribe(changes(fish).flipped);

export const swimming = (fish: Fish) =>
  fromEvent(window, 'resize')
    .pipe(
      startWith({}),
      switchMap(() =>
        from(fish.swimGenerator(maxPosition()), animationFrameScheduler)
      )
    )
    .pipe(
      filter((position) => position === 'rest'),
      map(() => randomPosition())
    )
    .subscribe(changes(fish).target);

export const avoiding = (fish: Fish) =>
  fromEvent(window, 'mousedown')
    .pipe(
      filter((event) => {
        const element = event.target as HTMLElement;
        return (
          element.tagName.toLowerCase() !== 'button' &&
          !(element?.parentElement.tagName === 'button')
        );
      }),
      switchMap((startEvent) =>
        fromEvent(window, 'mousemove').pipe(
          startWith(startEvent),
          switchMap((event) =>
            interval(100).pipe(
              map(() => event),
              startWith(event)
            )
          ),
          throttleTime(100),
          takeUntil(
            race(fromEvent(window, 'mouseup'), fromEvent(window, 'mouseout'))
          )
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
    .subscribe(changes(fish).target);

export const following = (fish: Fish, parent?: Fish, school?: School) =>
  parent &&
  school &&
  changes(parent)
    .target.pipe(map((position) => randomizePosition(position, school.size * 200)))
    .subscribe(changes(fish).target);
