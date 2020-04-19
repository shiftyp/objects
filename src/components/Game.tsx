import React, { useEffect, useRef } from "react";

import Masonry from "react-masonry-component";
import { Button, Flex, Box, Text } from "rebass";
import { Checkbox, Label } from "@rebass/forms";

import { BreedForm } from "./BreedForm";
import { RandomForm } from "./RandomForm";
import { DogImage } from "./DogImage";
import { BreedIndex } from "./BreedIndex";
import { UpdateSection } from "./UpdateSection";
import { ThemeProvider } from "./ThemeProvider";

import { useArray, useClass, useClasses, useObject } from "./hooks";

import { SearchTerms } from "./logic/SearchTerms";
import { ImageSearch } from "./logic/ImageSearch";
import { Breeds } from "./logic/Breeds";

import { shuffle } from "../utils";

const useGame = () => {
  const searchId = useRef<number>(0);
  const [local, resetLocal] = useObject({
    randomMode: true,
    selectMode: false,
    selectedImageSearch: null as
      | (ImageSearch & AsyncIterable<ImageSearch>)
      | null,
  });
  const [counts, resetCounts] = useObject({} as Record<string, number>);
  const [breeds] = useClass(Breeds);
  const [searches, resetSearches] = useArray(
    [] as Array<ImageSearch & AsyncIterable<ImageSearch>>
  );
  const makeImageSearch = useClasses(ImageSearch);
  const [terms, resetTerms] = useClass(SearchTerms, breeds);

  const addDog = async () => {
    const imageSearch = makeImageSearch(terms, searchId.current++);

    counts[imageSearch.breed] = (counts[imageSearch.breed] || 0) + 1;

    searches.push(imageSearch);
    shuffle(searches);

    await imageSearch.search();
  };

  const startSelectMode = (
    search: ImageSearch & AsyncIterable<ImageSearch>
  ) => {
    local.selectedImageSearch = search;
    local.selectMode = true;
    window.addEventListener("click", endSelectMode);
  };

  const endSelectMode = () => {
    local.selectMode = false;
    window.removeEventListener("click", endSelectMode);
  };

  const onImageClick = (search: ImageSearch & AsyncIterable<ImageSearch>) => (
    e: React.MouseEvent
  ) => {
    if (local.selectMode) endSelectMode();
    e.stopPropagation();
    startSelectMode(search);
  };

  const onBreedSelect = (breed: string) => {
    if (
      local.selectedImageSearch &&
      local.selectedImageSearch.breed === breed
    ) {
      const index = searches.indexOf(local.selectedImageSearch);

      if (index !== -1) {
        searches.splice(index, 1);
        counts[breed] = (counts[breed] || 1) - 1;

        if (counts[breed] === 0) {
          delete counts[breed];
        }
      } else {
        console.error("Oops");
      }

      endSelectMode();
    }
  };

  const resetGame = () => {
    resetLocal();
    resetCounts();
    resetSearches();
    resetTerms();
  };

  const toggleRandomMode = () => {
    local.randomMode = !local.randomMode;
  };

  useEffect(() => {
    breeds.load();
  }, [breeds]);

  return {
    resetGame,
    toggleRandomMode,
    onBreedSelect,
    onImageClick,
    addDog,
    searches,
    terms,
    breeds,
    counts,
    ...local,
  };
};

export const Game: React.FC = () => {
  const {
    counts,
    breeds,
    searches,
    terms,
    selectMode,
    selectedImageSearch,
    randomMode,
    onImageClick,
    onBreedSelect,
    toggleRandomMode,
    addDog,
    resetGame,
  } = useGame();

  const images: React.ReactNode[] = [];

  for (let i = searches.length - 1; i >= 0; i--) {
    const search = searches[i];

    images.push(
      <DogImage
        key={search.id}
        imageSearch={search}
        onClick={onImageClick(search)}
        fadeOut={selectMode && selectedImageSearch !== search}
      />
    );
  }

  return (
    <ThemeProvider>
      <UpdateSection updates={[breeds, ...searches]}>
        <Flex>
          {randomMode ? (
            <RandomForm terms={terms} addDog={addDog} />
          ) : (
            <BreedForm terms={terms} addDog={addDog} />
          )}
          <Box mr={10}>
            <Button onClick={resetGame}>Reset</Button>
          </Box>
          <Flex alignItems="center">
            <Label>
              <Checkbox checked={randomMode} onChange={toggleRandomMode} />
              <Flex alignItems="center">
                <Text fontFamily="sans-serif">Random Mode</Text>
              </Flex>
            </Label>
          </Flex>
        </Flex>
        <BreedIndex
          counts={counts}
          selectMode={selectMode}
          onSelect={onBreedSelect}
        />
        <Masonry>{images}</Masonry>
      </UpdateSection>
    </ThemeProvider>
  );
};
