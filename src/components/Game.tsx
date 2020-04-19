import React, { useEffect, useMemo } from "react";

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

export const Game: React.FC = () => {
  const [local, resetLocal] = useObject({
    randomMode: true,
    selectMode: false,
    selectedImageSearch: null as
      | (ImageSearch & AsyncIterable<ImageSearch>)
      | null,
  });
  const [breeds] = useClass(Breeds);
  const [imageSearches, resetImageSeaches] = useArray(
    [] as Array<ImageSearch & AsyncIterable<ImageSearch>>
  );
  const makeImageSearch = useClasses(ImageSearch);
  const [searchTerms, resetSearchTerms] = useClass(SearchTerms, breeds);

  const addDog = async () => {
    const imageSearch = makeImageSearch(searchTerms);
    imageSearches.push(imageSearch);
    shuffle(imageSearches);
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
      imageSearches.splice(imageSearches.indexOf(local.selectedImageSearch));
      endSelectMode();
    }
  };

  const resetGame = () => {
    resetLocal();
    resetImageSeaches();
    resetSearchTerms();
  };

  const toggleRandomMode = () => {
    local.randomMode = !local.randomMode;
  };

  useEffect(() => {
    breeds.load();
  }, [breeds]);

  const images: React.ReactNode[] = [];
  const counts: Record<string, number> = {};

  for (let i = imageSearches.length - 1; i >= 0; i--) {
    const search = imageSearches[i];

    images.push(
      <DogImage
        imageSearch={search}
        onClick={onImageClick(search)}
        fadeOut={local.selectMode && local.selectedImageSearch !== search}
      />
    );

    counts[search.breed] = (counts[search.breed] || 0) + 1;
  }

  return (
    <ThemeProvider>
      <UpdateSection updates={[breeds, ...imageSearches]}>
        <Flex>
          <Flex>
            {local.randomMode ? (
              <RandomForm terms={searchTerms} addDog={addDog} />
            ) : (
              <BreedForm terms={searchTerms} addDog={addDog} />
            )}
            <Box mr={10}>
              <Button onClick={resetGame}>Reset</Button>
            </Box>
            <Flex alignItems="center">
              <Label>
                <Checkbox
                  checked={local.randomMode}
                  onChange={toggleRandomMode}
                />
                <Flex alignItems="center">
                  <Text fontFamily="sans-serif">Random Mode</Text>
                </Flex>
              </Label>
            </Flex>
          </Flex>
        </Flex>
        <BreedIndex
          counts={counts}
          selectMode={local.selectMode}
          onSelect={onBreedSelect}
        />
        <Masonry>{images}</Masonry>
      </UpdateSection>
    </ThemeProvider>
  );
};
