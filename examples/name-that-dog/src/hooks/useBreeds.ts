import { useInstance } from '@objects/hooks'
import { useEffect, useMemo } from 'react'

import { ApiFetch } from '../logic/ApiFetch'
import { makeDogApiOptions } from '../utils'
import { BreedsRecord } from '../types'

export const useBreeds = () => {
  const [collection] = useInstance(
    ApiFetch,
    [],
    useMemo(() => makeDogApiOptions<BreedsRecord>(), [])
  )

  useEffect(() => {
    collection.fetch('/breeds/list/all')
  }, [collection])

  return { collection }
}
