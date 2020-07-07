import { useInstance } from '@objects/hooks'
import { Mode } from '../logic/Mode'

export const useGameModes = () => {
  const [randomMode, resetRandomMode] = useInstance(Mode, [], true)
  const [selectionMode, resetSelectionMode] = useInstance(Mode, [], false)

  return {
    randomMode,
    selectionMode,
    reset: () => {
      resetRandomMode()
      resetSelectionMode()
    },
  }
}
