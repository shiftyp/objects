import React from 'react';

import Masonry from 'react-masonry-component';
import { Button, Flex, Box, Text } from 'rebass';
import { Checkbox, Label } from '@rebass/forms';

import { BreedForm } from './BreedForm';
import { RandomForm } from './RandomForm';
import { DogImage } from './DogImage';
import { BreedIndex } from './BreedIndex';
import { UpdateSection } from './UpdateSection';

import { useGameLogic } from '../hooks/useGameLogic';

export const Game: React.FC = () => {
  const {
    terms,
    lists,
    breedsCollection,
    randomMode,
    selectionMode,
    selection,
    searches,
    createOnImageClick,
    selectBreed,
    addSearch,
    randomize,
    reset,
  } = useGameLogic();

  const images: React.ReactNode[] = [];

  for (const search of Object.values(searches)) {
    images.push(
      <DogImage
        key={search.id}
        terms={search}
        onClick={createOnImageClick(search)}
        fadeOut={selectionMode.value && selection.image !== search}
      />
    );
  }

  return (
    <UpdateSection updates={[breedsCollection]}>
      <Flex>
        {randomMode.value ? (
          <RandomForm randomize={randomize} addSearch={addSearch} />
        ) : (
          <BreedForm terms={terms} lists={lists} addSearch={addSearch} />
        )}
        <Box mr={10}>
          <Button onClick={reset}>Reset</Button>
        </Box>
        <Flex alignItems="center">
          <Label>
            <Checkbox checked={randomMode.value} onChange={randomMode.toggle} />
            <Flex alignItems="center">
              <Text fontFamily="sans-serif">Random Mode</Text>
            </Flex>
          </Label>
        </Flex>
      </Flex>
      <BreedIndex
        searches={searches}
        selectionMode={selectionMode}
        onSelect={selectBreed}
      />
      <Masonry>{images}</Masonry>
    </UpdateSection>
  );
};
