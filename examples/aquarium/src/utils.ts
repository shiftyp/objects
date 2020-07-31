import { FishPosition, Impulse, Fish, School } from './types'
// @ts-ignore
import kmeans from 'ml-kmeans'

export const dims: (keyof FishPosition)[] = ['x', 'y', 'z']

const buffer = 100
export const perspective = 1000

export const minPosition: FishPosition = {
  x: buffer,
  y: buffer,
  z: buffer,
}

export const maxPosition = (): FishPosition => ({
  x: window.innerWidth,
  y: window.innerHeight,
  z: 2000,
})

export const randomPosition = (
  max: FishPosition
): FishPosition => {
  const fov = fieldOfView(Math.random() * max.z, max)
  const extraX = fov.x - max.x
  const extraY = fov.y - max.y

  return {
    z: fov.z,
    x: Math.random() * (max.x + extraX) - extraX / 2,
    y: Math.random() * (max.y + extraY) - extraY / 2,
  }
}

export const randomizePosition = (
  target: FishPosition,
  radius: number
): FishPosition =>
  dims.reduce(
    (pos, dim) => {
      pos[dim] = pos[dim] - Math.random() * radius + radius / 2
      return pos
    },
    { ...target }
  )

export const translatePosition = (
  target: FishPosition,
  ...impulses: Impulse[]
) => {
  const current = { ...target }

  for (const { rho, theta, phi } of impulses) {
    current.x = current.x + rho * Math.sin(theta) * Math.cos(phi)
    current.y = current.y + rho * Math.sin(theta) * Math.sin(phi)
    current.z = current.z + rho * Math.cos(theta)
  }

  return current
}

export const fieldOfView = (z: number, max: FishPosition) => {
  const vFOV = 2 * Math.atan(max.y / (2 * perspective))
  const height = 2 * Math.tan(vFOV / 2) * (z + perspective)
  const hFOV = 2 * Math.atan(max.x / (2 * perspective))
  const width = 2 * Math.tan(hFOV / 2) * (z + perspective)

  return {
    z,
    x: width,
    y: height,
  }
}

export const inFieldOfView = (
  position: FishPosition,
  max: FishPosition
) => {
  const FOV = fieldOfView(position.z, max)

  const extraX = (FOV.x - max.x) / 2
  const extraY = (FOV.y - max.y) / 2

  return (
    position.x > 0 - extraX &&
    position.x < max.x + extraX &&
    position.y > 0 - extraY &&
    position.y < max.y + extraY &&
    position.z > 0 &&
    position.z < max.z
  )
}

export const impulseToRotateY = ({ phi, theta }: Impulse) => {
  const angle = Math.atan2(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta)
  )
  const freedom = Math.PI / 3
  const quarterTurn = Math.PI / 2
  const clampedAngle =
    angle > -quarterTurn + freedom && angle < 0
      ? -quarterTurn + freedom
      : angle > 0 && angle < quarterTurn - freedom
      ? quarterTurn - freedom
      : angle > quarterTurn + freedom
      ? quarterTurn + freedom
      : angle < -quarterTurn - freedom
      ? -quarterTurn - freedom
      : angle

  return clampedAngle + quarterTurn
}

export const towardsImpulse = (
  fish: Fish,
  fromPosition: FishPosition
): Impulse => {
  const deltaPosition = dims.reduce((pos, dim) => {
    pos[dim] = fromPosition[dim] - fish.position[dim]
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

export function* swimGenerator(fish: Fish, max: FishPosition) {
  do {
    let impulse = towardsImpulse(fish, fish.target)

    while (impulse.rho >= fish.speed) {
      const position = translatePosition(fish.position, {
        ...impulse,
        rho: fish.speed,
      })

      yield {
        position,
        impulse,
      }
      impulse = towardsImpulse(fish, fish.target)
    }
    yield null
  } while (true)
}

export const filterOutFishEvents = (event: MouseEvent) => {
  const targets = [
    event.target as HTMLElement,
    event.relatedTarget as HTMLElement,
  ]
  for (const element of targets) {
    if (
      element &&
      (element.tagName.toLowerCase() === 'button' ||
        element.tagName.toLowerCase() === 'span')
    ) {
      return false
    }
  }
  return true
}

export const id = () => (Date.now() + Math.random()).toFixed(15)

export const clusterSchool = (rootSchool: School) => {
  const schools: School[] = [{}, {}, {}, {}, {}, {}, {}, {}]
  const key = {}
  const ids = Object.keys(rootSchool)
  const values = ids.map(id => rootSchool[id])
  const coords = values.map(fish => [
    fish.position.x,
    fish.position.y,
    fish.position.z,
  ])
  const { clusters } = kmeans(
    coords,
    Math.min(ids.length, schools.length)
  )

  for (let i = 0; i < clusters.length; i++) {
    const index = clusters[i]
    const value = values[i]
    const id = ids[i]

    schools[index][id] = value
    key[id] = index
  }

  return {
    schools: schools.slice(
      0,
      Math.min(ids.length, schools.length)
    ),
    key,
  }
}
