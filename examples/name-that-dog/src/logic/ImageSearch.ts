import { DogApiFetch } from './DogApiFetch';
import { BreedTerms } from './BreedTerms';

export class ImageSearch extends DogApiFetch<string> {
  constructor(
    searchTerms: BreedTerms,
    public id: number,
    public terms = searchTerms.toArray(),
    public breed = terms.join(' ')
  ) {
    super();
  }

  async search() {
    return await this.fetch(`/breed/${this.terms.join('/')}/images/random`);
  }
}
