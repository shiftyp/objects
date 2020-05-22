import { dims, FishPosition, Impulse } from './types';

const buffer = 100;

export const minPosition: FishPosition = {
  x: buffer,
  y: buffer,
  z: buffer,
};

export const maxPosition = (): FishPosition => ({
  x: window.innerWidth,
  y: window.innerHeight,
  z: 2000,
});

export const randomPosition = (): FishPosition =>
  dims.reduce((pos, dim) => {
    pos[dim] = Math.max(Math.random() * pos[dim], minPosition[dim]);
    return pos;
  }, maxPosition());

export const randomizePosition = (
  target: FishPosition,
  radius: number
): FishPosition =>
  dims.reduce(
    (pos, dim) => {
      pos[dim] = pos[dim] - Math.random() * radius + radius / 2;
      return pos;
    },
    { ...target }
  );

export const translatePosition = (
  target: FishPosition,
  ...impulses: Impulse[]
) => {
  const current = { ...target };

  for (const { rho, theta, phi } of impulses) {
    current.x = current.x + rho * Math.sin(theta) * Math.cos(phi);
    current.y = current.y + rho * Math.sin(theta) * Math.sin(phi);
    current.z = current.z + rho * Math.cos(theta);
  }

  return current;
};

export const inFieldOfView = (
  position: FishPosition,
  max: FishPosition
) => {
  const vFOV = 2 * Math.atan(max.x / (2 * position.z));
  const height = 2 * Math.tan(vFOV / 2) * position.z;
  const aspect = max.x / max.y;
  const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);
  const width = 2 * Math.tan(hFOV / 2) * position.z;
  const extraY = (height - max.y) / 2;
  const extraX = (width - max.x) / 2;

  return (
    position.x > 0 - extraX &&
    position.x < max.x + extraX &&
    position.y > 0 - extraY &&
    position.y < max.y + extraY &&
    position.z > 0 &&
    position.z < max.z
  );
};
