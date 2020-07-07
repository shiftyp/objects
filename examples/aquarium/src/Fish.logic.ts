import { StatefulBase } from '@objects/operators'
import {
  randomPosition,
  maxPosition,
  minPosition,
  translatePosition,
  inFieldOfView,
} from './utils'

import { FishPosition, Impulse, dims } from './types'

import { name as fakeName } from 'faker'

export class Fish extends StatefulBase<Fish> {
  readonly position: FishPosition = randomPosition()
  readonly target: FishPosition = randomPosition()
  readonly impulse: Impulse = this.towardsImpulse(this.target)
  public name: string = fakeName.firstName()

  constructor(readonly speed: number, readonly id: string) {
    super()
  }

  towardsImpulse(fromPosition: FishPosition): Impulse {
    const deltaPosition = dims.reduce((pos, dim) => {
      pos[dim] = fromPosition[dim] - this.position[dim]
      return pos
    }, {} as FishPosition)

    let r = Math.sqrt(
      Math.pow(deltaPosition.x, 2) +
        Math.pow(deltaPosition.y, 2) +
        Math.pow(deltaPosition.z, 2)
    )
    let phi = Math.atan2(deltaPosition.y, deltaPosition.x)
    let theta = r > 0 ? Math.acos(deltaPosition.z / r) : NaN

    if (isNaN(theta)) {
      theta = Math.random() * 2 * Math.PI
    }
    if (isNaN(phi)) {
      phi = Math.random() * 2 * Math.PI
    }

    return { rho: r, theta, phi }
  }

  *swimGenerator(max: FishPosition = maxPosition()) {
    do {
      let impulse = this.towardsImpulse(this.target)

      while (impulse.rho >= this.speed) {
        const position = translatePosition(this.position, {
          ...impulse,
          rho: this.speed,
        })

        if (!inFieldOfView(position, max)) {
          break
        }
        yield {
          position,
          impulse,
        }
        impulse = this.towardsImpulse(this.target)
      }
      yield null
    } while (true)
  }
}
