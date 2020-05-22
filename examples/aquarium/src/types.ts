import { Stateful } from '@objects/types';

export interface FishPosition {
  x: number;
  y: number;
  z: number;
}

export interface Impulse {
  rho: number;
  phi: number;
  theta: number;
}

export type School = Stateful<{ size: number }>;

export const dims: (keyof FishPosition)[] = ['x', 'y', 'z'];
