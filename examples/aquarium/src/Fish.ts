import { StatefulBase, watch } from '@objects/operators';
import {
  randomPosition,
  maxPosition,
  minPosition,
  translatePosition,
  inFieldOfView,
} from './utils';

import { FishPosition, Impulse, dims } from './types';

export class Fish extends StatefulBase<Fish> {
  flipped: boolean = false;
  position: FishPosition = randomPosition();
  target: FishPosition = randomPosition();

  constructor(public speed: number) {
    super();
  }

  towardsImpulse = (fromPosition: FishPosition): Impulse => {
    const deltaPosition = dims.reduce((pos, dim) => {
      pos[dim] = fromPosition[dim] - this.position[dim];
      return pos;
    }, {} as FishPosition);

    let r = Math.sqrt(
      Math.pow(deltaPosition.x, 2) +
        Math.pow(deltaPosition.y, 2) +
        Math.pow(deltaPosition.z, 2)
    );
    let phi = Math.atan2(deltaPosition.y, deltaPosition.x);
    let theta = r > 0 ? Math.acos(deltaPosition.z / r) : NaN;

    if (isNaN(theta)) {
      theta = Math.random() * 2 * Math.PI;
    }
    if (isNaN(phi)) {
      phi = Math.random() * 2 * Math.PI;
    }

    return { rho: r, theta, phi };
  };

  awayImpulse = (fromPosition: FishPosition) => {
    const { rho, phi, theta } = this.towardsImpulse(fromPosition);

    return {
      rho,
      phi: phi,
      theta: theta + Math.PI,
    };
  };

  *swimGenerator(max: FishPosition = maxPosition()) {
    do {
      let impulse = this.towardsImpulse(this.target);

      while (impulse.rho > this.speed) {
        const newPosition = translatePosition(this.position, {
          ...impulse,
          rho: this.speed,
        });

        if (!inFieldOfView(newPosition, max)) {
          break;
        }
        this.position = newPosition;
        yield newPosition;
        impulse = this.towardsImpulse(this.target);
      }
      yield 'rest';
    } while (true);
  }
}
