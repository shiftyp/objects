import React, { useEffect } from "react";

import { Text, Link, Button, Card } from "rebass";

import { useClass } from "./hooks";

import { ArticleFetch } from "./logic/ArticleFetch";

export const BreedLink: React.FC<{
  breed: string;
  count: number;
  buttonMode?: boolean;
  onClick: () => void;
}> = ({ breed, count, buttonMode = false, onClick }) => {
  const [article] = useClass(ArticleFetch);

  useEffect(() => {
    article.load(breed);
  }, [article, breed]);

  const text =
    article.data && !buttonMode ? (
      <Text>
        <Link href={article.data} title={`${breed} on Wikipedia`}>
          {breed}
        </Link>
        : {count}
      </Text>
    ) : (
      <Text onClick={onClick}>
        {breed}: {count}
      </Text>
    );

  return buttonMode ? (
    <Button margin={10} variant="outline" onClick={onClick}>
      {text}
    </Button>
  ) : (
    <Card margin={10}>{text}</Card>
  );
};
