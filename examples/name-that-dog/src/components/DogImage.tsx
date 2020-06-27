import React from 'react';

import { Image, Box } from 'rebass';

import { ImageSearch } from '../logic/ImageSearch';
import { useImageSearch } from '../hooks/useImageSearch';
import { UpdateSection } from './UpdateSection';

export const DogImage: React.FC<{
  terms: string[];
  onClick: (e: React.MouseEvent) => void;
  fadeOut: boolean;
}> = ({ terms, onClick, fadeOut }) => {
  const { imageSearch } = useImageSearch(terms);

  return (
    <Box width={200} margin={10}>
      <UpdateSection updates={[imageSearch]}>
        <Image
          style={{
            maxWidth: 200,
            opacity: fadeOut ? 0.5 : 1,
            cursor: 'pointer',
          }}
          onClick={onClick}
          src={imageSearch.data || undefined}
          alt={imageSearch.terms.join(' ') || ''}
        />
      </UpdateSection>
    </Box>
  );
};
