import { useInstance } from '@objects/hooks'
import { useEffect, useMemo } from 'react'
import { ApiFetch } from '../logic/ApiFetch'
import { makeDogApiOptions, toPath } from '../utils'
import { BreedTermsList } from '../types'

export const useImageSearch = (terms: BreedTermsList) => {
  const apiOptions = useMemo(() => makeDogApiOptions<string>(), [])
  const [search] = useInstance(ApiFetch, [], apiOptions)
  const path = toPath(terms)

  useEffect(() => {
    if (path) {
      search.fetch(`/breed/${path}/images/random`)
    }
  }, [search, path])

  return { search }
}
