import React from "react";

import { Flex, Card } from "rebass";
import { BreedLink } from "./BreedLink";

export const BreedIndex: React.FC<{
  counts: Record<string, number>;
  selectMode: boolean;
  onSelect: (breed: string) => void;
}> = ({ counts, selectMode, onSelect }) => {
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
