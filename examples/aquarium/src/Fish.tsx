import React, {
  useContext,
  createContext,
  CSSProperties,
} from 'react'
import { useObject } from '@objects/hooks'

import classNames from 'classNames'

import { ClusterContext, School, Fish } from './types'

import { useSwimming, useFeeding, useFollowing } from './hooks'
import { impulseToRotateY } from './utils'
import { Stable } from '@objects/types'

export const FishComponent: React.FC<{
  id: string
  school: School
  addFish: (kind: string, speed: number) => void
}> = ({ id, addFish, school }) => {
  const fish = school[id]

  let parent = Object.values(school).find(
    other => other.kind === fish.kind
  )

  if (parent === fish) {
    parent = null
  }

  useSwimming(fish)
  useFeeding(fish)
  useFollowing(fish, parent)

  const { x, y, z } = fish.position

  return (
    <>
      <button
        id={id}
        className="fish"
        style={{
          top: y,
          left: x,
          transform: `translateZ(${-z}px) `,
          zIndex: Math.floor(2000 - z),
        }}
        onClick={() => addFish(fish.kind, fish.speed)}
      >
        <span
          style={{
            filter: `blur(${z > 250 ? Math.log(z / 50) : 0}px)`,
            transform: `rotateY(${impulseToRotateY(
              fish.impulse
            )}rad)`,
          }}
        >
          <span
            className="swim"
            style={{
              animationDuration: `${3 / fish.speed}s`,
            }}
            key="swim"
            aria-label="fish"
            role="image"
          >
            <span className="scale">{fish.kind}</span>
          </span>
        </span>
        {/* <input
          className="title"
          value={fish.name}
          onClick={e => e.stopPropagation()}
          onChange={({ target }) => (fish.name = target.value)}
        /> */}
      </button>
    </>
  )
}
