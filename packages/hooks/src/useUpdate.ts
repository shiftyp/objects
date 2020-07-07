import { useReducer } from 'react'

export const useUpdate = (): [() => void, number] => {
  const [updates, update] = useReducer(
    (lastUpdate) => (lastUpdate + 1) % Number.MAX_SAFE_INTEGER,
    0
  )
  return [update, updates]
}
