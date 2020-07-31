import React from 'react'

import { Image, Box } from 'rebass'

import { useImageSearch } from '../hooks/useImageSearch'
import { UpdateSection } from './UpdateSection'
import { toBreed } from '../utils'

export const DogImage: React.FC<{
  id: string
  terms: string[]
  onClick: (e: React.MouseEvent) => void
  fadeOut: boolean
}> = ({ id, terms, onClick, fadeOut }) => {
  const { search } = useImageSearch(terms)

  return (
    <Box width={200} margin={10} style={{ position: 'relative' }} minHeight={200}>
      <UpdateSection updates={[search]}>
        {search.data ? (
          <Image
            style={{
              maxWidth: 200,
              opacity: fadeOut ? 0.5 : 1,
              cursor: 'pointer',
            }}
            onClick={onClick}
            src={search.data}
            alt={toBreed(terms) || undefined}
          />
        ) : null}
      </UpdateSection>
    </Box>
  )
}
