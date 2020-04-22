import React, { useEffect, useRef } from 'react';

import Masonry from 'react-masonry-component';
import { Button, Flex, Box, Text } from 'rebass';
import { Checkbox, Label } from '@rebass/forms';

import { BreedForm } from './BreedForm';
import { RandomForm } from './RandomForm';
import { DogImage } from './DogImage';
import { BreedIndex } from './BreedIndex';
import { UpdateSection } from './UpdateSection';
import { ThemeProvider } from './ThemeProvider';

import { ImageSearch } from '../logic/ImageSearch';
import { Breeds } from '../logic/Breeds';
import { GameLogic } from '../logic/GameLogic';

import { useObject } from '../hooks/useObject';
import { useArray } from '../hooks/useArray';
import { useInstances } from '../hooks/useInstances';
import { useInstance } from '../hooks/useInstance';
import { SearchTerms } from '../logic/SearchTerms';
import { HooksProxy } from '../hooks/types';

const useGame = () => {
  const [breeds] = useInstance(Breeds);
  const [terms, resetTerms] = useInstance(SearchTerms, breeds);
  const [counts, resetCounts] = useObject<Record<string, number>>({});
  const [searches, resetSearches] = useArray<HooksProxy<ImageSearch>>([]);
  const createSearch = useInstances(ImageSearch);

  const [logic, resetGame] = useInstance(
    GameLogic,
    terms,
    counts,
    searches,
    createSearch
  );

  const onImageClick = (search: ImageSearch & AsyncIterable<ImageSearch>) => (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    logic.startSelectMode(search);
  };

  useEffect(() => {
    breeds.load();
  }, [breeds]);

  return {
    logic,
    counts,
    searches,
    terms,
    reset: () => {
      resetCounts();
      resetSearches();
      resetTerms();
      resetGame();
    },
    onImageClick,
    breeds,
  };
};

export const Game: React.FC = () => {
  const {
    searches,
    terms,
    counts,
    logic,
    breeds,
    onImageClick,
    reset,
  } = useGame();

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
    <ThemeProvider>
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
    </ThemeProvider>
  );
};
