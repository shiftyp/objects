import React from 'react'
import { useObject } from '@objects/hooks'

import {
  Fish,
  OceanProps,
  School,
  ClusterContext,
  FishKinds,
} from './types'

import {
  id,
  clusterSchool,
  randomPosition,
  perspective,
  maxPosition,
} from './utils'

import { FishComponent } from './Fish'

import { name as fakeName } from 'faker'
import { Stabilize } from '@objects/types'

const constructOceanState = (kinds: FishKinds) => (
  stabilize: Stabilize
) => {
  const initial = {} as School

  const addFish = (
    school: School,
    kind: string,
    speed: number
  ) => {
    const max = maxPosition()

    school[id()] = stabilize({
      position: randomPosition(max),
      target: randomPosition(max),
      impulse: {
        rho: 0,
        theta: 0,
        phi: 0,
      },
      name: fakeName.firstName(),
      kind,
      speed,
    } as Fish)
  }

  for (const kind of Object.keys(kinds)) {
    const ofKind = 4

    for (let i = 0; i < ofKind; i++) {
      addFish(initial, kind, kinds[kind])
    }
  }

  const instance = {
    school: stabilize(initial),
    addFish: (kind: string, speed: number) =>
      addFish(instance.school, kind, speed),
  }

  return instance
}

export const Ocean: React.FC<OceanProps> = ({ kinds }) => {
  const [local] = useObject(constructOceanState(kinds))

  const { schools, key } = clusterSchool(local.school)

  return (
    <div
      id="ocean"
      style={{
        perspective: `${perspective}px`,
      }}
      onTouchMove={e => e.preventDefault()}
    >
      {Object.keys(local.school).map(id => (
        <FishComponent
          key={id}
          id={id}
          school={schools[key[id]]}
          addFish={local.addFish}
        />
      ))}
    </div>
  )
}
