import { createContext } from 'react'
import { Stable } from '@objects/types'

export interface FishPosition {
  x: number
  y: number
  z: number
}

export interface Impulse {
  rho: number
  phi: number
  theta: number
}

export interface Fish {
  name: string
  speed: number
  kind: string
  position: FishPosition
  target: FishPosition
  impulse: Impulse
}

export interface FishProps {
  id: string
}

export type FishKinds = Record<string, number>

export interface OceanProps {
  kinds: FishKinds
}

export type School = Record<string, Stable<Fish>>

export const ClusterContext = createContext<School | null>(null)
