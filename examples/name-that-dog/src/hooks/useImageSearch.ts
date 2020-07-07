import { useEffect } from 'react'
import { useInstance } from '@objects/hooks'

import { ImageSearch } from '../logic/ImageSearch'

export const useImageSearch = (terms: string[], id: string) => {
  const [imageSearch] = useInstance(ImageSearch, [], terms, id)

  useEffect(() => {
    imageSearch.search()
  }, [imageSearch])

  return {
    imageSearch,
  }
}
