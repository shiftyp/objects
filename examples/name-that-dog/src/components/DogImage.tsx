import React from 'react'

import { Image, Box } from 'rebass'

import { useImageSearch } from '../hooks/useImageSearch'
import { UpdateSection } from './UpdateSection'

export const DogImage: React.FC<{
  id: string
  terms: string[]
  onClick: (e: React.MouseEvent) => void
  fadeOut: boolean
}> = ({ id, terms, onClick, fadeOut }) => {
  const { imageSearch } = useImageSearch(terms, id)

  return (
    <Box width={200} margin={10} style={{ position: 'relative' }} minHeight={200}>
      <UpdateSection updates={[imageSearch]}>
        {imageSearch.data ? (
          <Image
            style={{
              maxWidth: 200,
              opacity: fadeOut ? 0.5 : 1,
              cursor: 'pointer',
            }}
            onClick={onClick}
            src={imageSearch.data}
            alt={imageSearch.terms.join(' ') || ''}
          />
        ) : null}
      </UpdateSection>
    </Box>
  )
}
