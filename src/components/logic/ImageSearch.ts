import { DogApiFetch } from './DogApiFetch';
import { SearchTerms } from './SearchTerms';

export class ImageSearch extends DogApiFetch<string> {
  constructor(
    searchTerms: SearchTerms,
    public id: number,
    private terms = searchTerms.toArray()
  ) {
    super();
  }

  get breed() {
    return this.terms.join(' ');
  }

  async search() {
    return await this.fetch(`/breed/${this.terms.join('/')}/images/random`);
  }
}
