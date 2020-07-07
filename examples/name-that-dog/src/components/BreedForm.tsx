import React, { useRef, FormEvent, ChangeEvent } from 'react';
import { Select } from '@rebass/forms';
import { Button, Box, Flex } from 'rebass';
import { BreedTerms } from '../logic/BreedTerms';

export const BreedForm: React.FC<{
  terms: BreedTerms;
  lists: any;
  addSearch: () => void;
}> = ({ terms, lists, addSearch }) => {
  const onListSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    terms.selected = e.target.value;
  };

  const onSecondaryListSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    terms.secondarySelected = e.target.value;
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    addSearch();
  };

  return (
    <Flex as="form" onSubmit={onFormSubmit}>
      <Box mr={10}>
        {!!lists.primaryList?.length && (
          <Select value={terms.selected || undefined} onChange={onListSelectChange}>
            {lists.primaryList.map((breed) => (
              <option value={breed} key={breed}>
                {breed}
              </option>
            ))}
          </Select>
        )}
      </Box>
      <Box mr={10}>
        {!!lists.secondaryList?.length && (
          <Select
            value={terms.secondarySelected || undefined}
            onChange={onSecondaryListSelectChange}
          >
            {lists.secondaryList.map((breed) => (
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
