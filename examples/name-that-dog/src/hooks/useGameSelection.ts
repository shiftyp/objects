import { Stateful, useInstance, useObserveMap } from 'object-hooks';
import { GameSelection } from '../logic/GameSelection';
import { Mode } from '../logic/Mode';

export const useGameSelection = (selectionMode: Stateful<Mode>) => {
  const [selection, resetSelection] = useInstance(GameSelection);

  useObserveMap(selection, {
    image: (image) => {
      selectionMode.value = !!image;
    },
  });

  return {
    selection,
    reset: resetSelection,
  };
};
