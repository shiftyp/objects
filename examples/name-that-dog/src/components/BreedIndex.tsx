import React from 'react';

import { Flex } from 'rebass';
import { BreedLink } from './BreedLink';
import { ImageSearch } from '../logic/ImageSearch';
import { Stateful } from 'object-hooks';
import { useBreedCounts } from '../hooks/useBreedCounts';
import { Mode } from '../logic/Mode';

export const BreedIndex: React.FC<{
  searches: Stateful<Record<number, Stateful<ImageSearch>>>;
  selectionMode: Mode;
  onSelect: (breed: string) => void;
}> = ({ searches, selectionMode: selectMode, onSelect }) => {
  const { counts } = useBreedCounts(searches);

  return (
    <Flex flexWrap="wrap">
      {Object.keys(counts).map((breed) => (
        <BreedLink
          key={breed}
          breed={breed}
          count={counts[breed]}
          buttonMode={selectMode}
          onClick={selectMode ? () => onSelect(breed) : () => {}}
        />
      ))}
    </Flex>
  );
};
