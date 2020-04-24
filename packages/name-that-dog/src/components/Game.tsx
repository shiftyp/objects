import React from 'react';

import Masonry from 'react-masonry-component';
import { Button, Flex, Box, Text } from 'rebass';
import { Checkbox, Label } from '@rebass/forms';

import { BreedForm } from './BreedForm';
import { RandomForm } from './RandomForm';
import { DogImage } from './DogImage';
import { BreedIndex } from './BreedIndex';
import { UpdateSection } from './UpdateSection';
import { ThemeProvider } from './ThemeProvider';

import { useGameLogic } from '../hooks/useGameLogic';

export const Game: React.FC = () => {
  const {
    searches,
    terms,
    counts,
    logic,
    breeds,
    onImageClick,
    reset,
  } = useGameLogic();

  const images: React.ReactNode[] = [];

  for (let i = searches.length - 1; i >= 0; i--) {
    const search = searches[i];

    images.push(
      <DogImage
        key={search.id}
        imageSearch={search}
        onClick={onImageClick(search)}
        fadeOut={logic.selectMode && logic.selectedImageSearch !== search}
      />
    );
  }

  return (
    <UpdateSection updates={[breeds, ...searches]}>
      <Flex>
        {logic.randomMode ? (
          <RandomForm terms={terms} addDog={logic.addDog} />
        ) : (
          <BreedForm terms={terms} addDog={logic.addDog} />
        )}
        <Box mr={10}>
          <Button onClick={reset}>Reset</Button>
        </Box>
        <Flex alignItems="center">
          <Label>
            <Checkbox
              checked={logic.randomMode}
              onChange={logic.toggleRandomMode}
            />
            <Flex alignItems="center">
              <Text fontFamily="sans-serif">Random Mode</Text>
            </Flex>
          </Label>
        </Flex>
      </Flex>
      <BreedIndex
        counts={counts}
        selectMode={logic.selectMode}
        onSelect={logic.selectBreed}
      />
      <Masonry>{images}</Masonry>
    </UpdateSection>
  );
};
