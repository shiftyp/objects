import React, { useRef, FormEvent, ChangeEvent } from "react";
import { Select } from "@rebass/forms";
import { Button, Box, Flex } from "rebass";

import { SearchTerms } from "./logic/SearchTerms";

export const BreedForm: React.FC<{
  terms: SearchTerms;
  addDog: () => void;
}> = ({ terms, addDog }) => {
  const onListSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    terms.selected = e.target.value;
  };

  const onSecondaryListSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    terms.secondarySelected = e.target.value;
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    addDog();
  };

  return (
    <Flex as="form" onSubmit={onFormSubmit}>
      <Box mr={10}>
        {!!terms.breedNames.length && (
          <Select
            value={terms.selected || undefined}
            onChange={onListSelectChange}
          >
            {terms.breedNames.map((breed) => (
              <option value={breed} key={breed}>
                {breed}
              </option>
            ))}
          </Select>
        )}
      </Box>
      <Box mr={10}>
        {!!terms.secondaryBreedNames.length && (
          <Select
            value={terms.secondarySelected || undefined}
            onChange={onSecondaryListSelectChange}
          >
            {terms.secondaryBreedNames.map((breed) => (
              <option value={breed} key={breed}>
                {breed}
              </option>
            ))}
          </Select>
        )}
      </Box>
      <Box mr={10}>
        <Button type="submit">Fetch!</Button>
      </Box>
    </Flex>
  );
};
