import { Stateful } from '@objects/types';
import { useInstance, useBehavior } from '@objects/hooks';
import { changes } from '@objects/operators';
import { map } from 'rxjs/operators';
import { GameSelection } from '../logic/GameSelection';
import { Mode } from '../logic/Mode';

export const useGameSelection = (selectionMode: Stateful<Mode>) => {
  const [selection, resetSelection] = useInstance(GameSelection);

  useBehavior(
    () =>
      changes(selection)
        .image.pipe(map((image) => !!image))
        .subscribe(changes(selectionMode).value),
    [selection, selectionMode]
  );

  return {
    selection,
    reset: resetSelection,
  };
};
