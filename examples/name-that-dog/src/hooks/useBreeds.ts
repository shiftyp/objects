import { useInstance } from 'object-hooks';
import { useEffect } from 'react';
import { BreedsCollection } from '../logic/BreedsCollection';

export const useBreeds = () => {
  const [collection, reset] = useInstance(BreedsCollection);

  useEffect(() => {
    collection.load();
  }, [collection]);

  return { collection, reset };
};
