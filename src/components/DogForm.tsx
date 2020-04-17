import React, { useRef, FormEvent } from "react";

import { BreedTerms } from "./logic/breeds/BreedTerms";
import { ImageSearch } from "./logic/ImageSearch";

export const DogForm: React.FC<{ terms: BreedTerms; images: ImageSearch }> = ({
  terms,
  images,
}) => {
  const listSelectRef = useRef<HTMLSelectElement>(null);
  const secondaryListSelectRef = useRef<HTMLSelectElement>(null);

  const onListSelectChange = () => {
    terms.selected = listSelectRef.current?.value || "";
    terms.secondarySelected = terms.secondaryBreedNames[0];
  };

  const onSecondaryListSelectChange = () => {
    terms.secondarySelected = secondaryListSelectRef.current?.value || "";
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    images.search();
  };

  return (
    <form onSubmit={onFormSubmit}>
      {!!terms.breedNames.length && (
        <select
          ref={listSelectRef}
          value={terms.selected || undefined}
          onChange={onListSelectChange}
        >
          {terms.breedNames.map((breed) => (
            <option value={breed} key={breed}>
              {breed}
            </option>
          ))}
        </select>
      )}
      {!!terms.secondaryBreedNames.length && (
        <select
          ref={secondaryListSelectRef}
          value={terms.secondarySelected || undefined}
          onChange={onSecondaryListSelectChange}
        >
          {terms.secondaryBreedNames.map((breed) => (
            <option value={breed} key={breed}>
              {breed}
            </option>
          ))}
        </select>
      )}
      <button type="submit">Fetch!</button>
    </form>
  );
};
