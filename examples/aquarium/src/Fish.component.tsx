import React, { useContext, createContext } from 'react'
import { useInstance, useObject, useObserve } from '@objects/hooks'
import classNames from 'classNames'

import { Fish as FishLogic } from './Fish.logic'
import { School, Impulse } from './types'

import { swimming, feeding, following } from './Fish.behaviors'

import './index.scss'

type Parent = {
  fish: FishLogic
  school: School
}

const ParentContext = createContext<Parent | null>(null)

const impulseToRotation = ({ rho, phi, theta }: Impulse) => {
  const angle = Math.atan2(Math.sin(theta) * Math.cos(phi), Math.cos(theta))
  const freedom = Math.PI / 4
  const clampedAngle =
    angle > -Math.PI / 2 + freedom && angle < 0
      ? -Math.PI / 2 + freedom
      : angle > 0 && angle < Math.PI / 2 - freedom
      ? Math.PI / 2 - freedom
      : angle > Math.PI / 2 + freedom
      ? Math.PI / 2 + freedom
      : angle < -Math.PI / 2 - freedom
      ? -Math.PI / 2 - freedom
      : angle

  return clampedAngle + Math.PI / 2
}

export const Fish: React.FC<{
  id: string
  speed: number
}> = ({ children, speed, id }) => {
  const parent = useContext(ParentContext)
  const [fish] = useInstance(FishLogic, [parent?.fish], speed, id)
  const [school] = useObject({
    size: 0,
  })

  useObserve(swimming, [fish])
  useObserve(feeding, [fish, parent?.school])
  useObserve(following, [fish, parent?.fish, parent?.school])

  let schoolFish = []

  for (let i = 0; i < school.size; i++) {
    schoolFish.push(
      <Fish key={i} id={`${fish.id}-${i}`} speed={fish.speed}>
        {children}
      </Fish>
    )
  }

  const { x, y, z } = fish.position
  const { phi, theta } = fish.impulse
  return (
    <>
      <button
        id={fish.id}
        className="fish"
        style={{
          top: y,
          left: x,
          transform: `translateZ(${-z}px) `,
          zIndex: Math.floor(2000 - z),
        }}
        onClick={() => school.size++}
      >
        <span
          aria-label="fish"
          className={classNames({
            swim: fish.target,
          })}
          style={{
            filter: `blur(${z > 250 ? Math.log(z / 50) : 0}px)`,
            transform: `rotateY(${impulseToRotation(fish.impulse)}rad)`,
          }}
          role="image"
        >
          {children}
        </span>
        <input
          className="title"
          value={fish.name}
          onClick={(e) => e.stopPropagation()}
          onChange={({ target }) => (fish.name = target.value)}
        />
      </button>
      <ParentContext.Provider value={{ fish, school }}>
        {schoolFish}
      </ParentContext.Provider>
    </>
  )
}
