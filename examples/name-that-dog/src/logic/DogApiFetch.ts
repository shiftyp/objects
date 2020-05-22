import { ApiFetch } from './ApiFetch';

interface DogApiResponse<Data> {
  message: Data;
}

export abstract class DogApiFetch<Data> extends ApiFetch<
  Data,
  DogApiResponse<Data>
> {
  apiBase = 'https://dog.ceo/api';
  apiSuffix = undefined;

  transform = (response) => response.message;
}
