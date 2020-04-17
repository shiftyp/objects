import React, { useEffect } from "react";

import { useClass, useObject } from "./hooks";

import { DogForm } from "./DogForm";
import { UpdateSection } from "./UpdateSection";

import { BreedTerms } from "./logic/breeds/BreedTerms";
import { ImageSearch } from "./logic/ImageSearch";
import { Breeds } from "./logic/breeds/Breeds";
import { Logger } from "./logic/Logger";

export default function App() {
  const breeds = useClass(Breeds);
  const breedTerms = useClass(BreedTerms, breeds);
  const imageSearch = useClass(ImageSearch, breedTerms);
  const logger = useClass(Logger, imageSearch);

  useEffect(() => {
    breeds.load();
    logger.watch();
  }, [breedTerms]);

  return (
    <UpdateSection updates={[breeds, imageSearch]}>
      <DogForm terms={breedTerms} images={imageSearch} />
      {imageSearch.data ? (
        <img src={imageSearch.data} alt={imageSearch.breed || ""} />
      ) : null}
    </UpdateSection>
  );
}
