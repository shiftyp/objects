import { DogApiFetch } from "./DogApiFetch";

type BreedsRecord = Record<string, string[]>;

export class Breeds extends DogApiFetch<BreedsRecord> {
  load() {
    return this.fetch("/breeds/list/all");
  }
}
