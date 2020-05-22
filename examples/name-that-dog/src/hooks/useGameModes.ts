import { useInstance } from 'object-hooks';
import { Mode } from '../logic/Mode';

export const useGameModes = () => {
  const [randomMode, resetRandomMode] = useInstance(Mode, false);
  const [selectionMode, resetSelectionMode] = useInstance(Mode, false);

  return {
    randomMode,
    selectionMode,
    reset: () => {
      resetRandomMode();
      resetSelectionMode();
    },
  };
};
