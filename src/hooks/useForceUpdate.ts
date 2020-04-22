import { useReducer } from 'react';

export const useForceUpdate = () => {
  const [_, update] = useReducer(
    (lastUpdate) => (lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
    0
  );
  return update;
};
