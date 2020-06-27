import { DogApiFetch } from './DogApiFetch';
import { BreedTerms } from './BreedTerms';

export class ImageSearch extends DogApiFetch<string> {
  constructor(public terms: string[]) {
    super();
  }

  async search() {
    return await this.fetch(`/breed/${this.terms.join('/')}/images/random`);
  }
}
