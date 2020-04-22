import { useRef } from 'react';

import { ImageSearch } from './ImageSearch';
import { SearchTerms } from './SearchTerms';
import { Breeds } from './Breeds';

import { shuffle } from '../utils';
import { HooksProxy } from '../hooks/types';

export class GameLogic {
  searchId = 0;

  randomMode = true;
  selectMode = false;
  selectedImageSearch: (ImageSearch & AsyncIterable<ImageSearch>) | null = null;

  constructor(
    private breeds: HooksProxy<Breeds>,
    private terms: HooksProxy<SearchTerms>,
    private counts: HooksProxy<Record<string, number>>,
    private searches: HooksProxy<HooksProxy<ImageSearch>[]>,
    private createSearch: (
      ...args: ConstructorParameters<typeof ImageSearch>
    ) => HooksProxy<ImageSearch>
  ) {}

  addDog = async () => {
    const imageSearch = this.createSearch(this.terms, this.searchId++);

    this.counts[imageSearch.breed] = (this.counts[imageSearch.breed] || 0) + 1;

    this.searches.push(imageSearch);
    shuffle(this.searches);

    await imageSearch.search();
  };

  toggleRandomMode = () => {
    this.randomMode = !this.randomMode;
  };

  startSelectMode(search: ImageSearch & AsyncIterable<ImageSearch>) {
    this.selectedImageSearch = search;
    this.selectMode = true;
    window.addEventListener('click', this.endSelectMode);
  }

  endSelectMode() {
    this.selectMode = false;
    window.removeEventListener('click', this.endSelectMode);
  }
}
