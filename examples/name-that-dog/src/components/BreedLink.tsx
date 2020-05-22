import React, { useEffect } from 'react';

import { Text, Link, Button, Card } from 'rebass';

import { useInstance } from 'object-hooks';

import { ArticleFetch } from '../logic/ArticleFetch';
import { Mode } from '../logic/Mode';

export const BreedLink: React.FC<{
  breed: string;
  count: number;
  buttonMode?: Mode;
  onClick: () => void;
}> = ({ breed, count, buttonMode, onClick }) => {
  const [article] = useInstance(ArticleFetch);

  useEffect(() => {
    article.load(breed);
  }, [article, breed]);

  const text =
    article.data?.href && !buttonMode?.value ? (
      <Text>
        <Link
          href={article.data.href}
          title={`${breed} on Wikipedia`}
          target="_blank"
        >
          {article.data?.title || breed}
        </Link>
        : {count}
      </Text>
    ) : (
      <Text>
        {article.data?.title || breed}: {count}
      </Text>
    );

  return buttonMode?.value ? (
    <Button margin={10} variant="outline" onClick={onClick}>
      {text}
    </Button>
  ) : (
    <Card margin={10}>{text}</Card>
  );
};
