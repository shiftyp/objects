import { DogApiFetch } from './DogApiFetch';

type BreedsRecord = Record<string, string[]>;

export class BreedsCollection extends DogApiFetch<BreedsRecord> {
  load() {
    return this.fetch('/breeds/list/all');
  }
}
