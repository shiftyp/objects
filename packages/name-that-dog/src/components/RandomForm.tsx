import React, { FormEvent, ChangeEvent } from 'react';
import { Input } from '@rebass/forms';
import { Button, Box, Flex } from 'rebass';

import { useObject } from 'object-hooks';

import { SearchTerms } from '../logic/SearchTerms';

import {
  unstable_trace as trace,
  unstable_wrap as wrap,
} from 'scheduler/tracing-profiling';

export const RandomForm: React.FC<{
  terms: SearchTerms;
  addDog: () => void;
}> = ({ terms, addDog }) => {
  const [local] = useObject({
    numDogs: 5,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    local.numDogs = e.target.valueAsNumber;
  };

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    return trace('RandomForm submit', performance.now(), async () => {
      const add = wrap(addDog);

      for (var i = 0; i < local.numDogs; i++) {
        terms.randomize();
        await add();
      }
    });
  };

  return (
    <Flex as="form" onSubmit={onFormSubmit}>
      <Box mr={10}>
        <Input
          type="number"
          onChange={onChange}
          value={local.numDogs}
          max={20}
          min={1}
        />
      </Box>
      <Box mr={10}>
        <Button type="submit">Fetch!</Button>
      </Box>
    </Flex>
  );
};
