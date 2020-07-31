import { useObject } from '@objects/hooks'
import { Mode } from '../types'

export const useGameModes = () => {
  const [randomMode, resetRandomMode] = useObject({
    value: true,
  } as Mode)
  const [selectionMode, resetSelectionMode] = useObject({
    value: false,
  } as Mode)

  return {
    randomMode,
    selectionMode,
    reset: () => {
      resetRandomMode()
      resetSelectionMode()
    },
  }
}
