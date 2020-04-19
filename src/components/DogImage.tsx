import React from "react";

import { Image, Box } from "rebass";

import { ImageSearch } from "./logic/ImageSearch";

export const DogImage: React.FC<{
  imageSearch: ImageSearch;
  onClick: (e: React.MouseEvent) => void;
  fadeOut: boolean;
}> = ({ imageSearch, onClick, fadeOut }) => {
  return (
    <Box width={200} margin={10}>
      {imageSearch.data ? (
        <Image
          style={{
            maxWidth: 200,
            opacity: fadeOut ? 0.5 : 1,
            cursor: "pointer",
          }}
          onClick={onClick}
          src={imageSearch.data}
          alt={imageSearch.breed || ""}
        />
      ) : null}
    </Box>
  );
};
