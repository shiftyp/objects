import React, { useEffect, useRef } from "react";

import { useClass } from "./hooks";

import { DogList } from "./logic/DogList";
import { ImageSearch } from "./logic/ImageSearch";

export default function App() {
  const listSelectRef = useRef<HTMLSelectElement>(null);
  const secondaryListSelectRef = useRef<HTMLSelectElement>(null);

  const dogList = useClass(DogList);
  const imageSearch = useClass(ImageSearch);

  useEffect(() => {
    dogList.load();
  }, [dogList]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const terms = [];

    if (listSelectRef.current) {
      terms.push(listSelectRef.current.value);
    }

    if (dogList.secondaryList.length && secondaryListSelectRef.current) {
      terms.push(secondaryListSelectRef.current.value);
    }

    if (terms.length) {
      imageSearch.search(terms);
    }
  };

  const onListSelectChange = () => {
    dogList.selected = listSelectRef.current && listSelectRef.current.value;
  };

  return (
    <>
      {dogList.updating ? (
        "Loading dog list..."
      ) : (
        <form onSubmit={onFormSubmit}>
          {!!dogList.list.length && (
            <select ref={listSelectRef} onChange={onListSelectChange}>
              {dogList.list.map((breed) => (
                <option value={breed} key={breed}>
                  {breed}
                </option>
              ))}
            </select>
          )}
          {!!dogList.secondaryList.length && (
            <select ref={secondaryListSelectRef}>
              {dogList.secondaryList.map((breed) => (
                <option value={breed} key={breed}>
                  {breed}
                </option>
              ))}
            </select>
          )}
          <button type="submit">Fetch!</button>
        </form>
      )}
      {imageSearch.updating
        ? `Loading image of ${imageSearch.breed}...`
        : imageSearch.data && (
            <img src={imageSearch.data} alt={imageSearch.breed || ""} />
          )}
    </>
  );
}
