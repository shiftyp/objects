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

  selectBreed = (breed: string) => {
    if (this.selectedImageSearch && this.selectedImageSearch.breed === breed) {
      const index = this.searches.indexOf(this.selectedImageSearch);

      if (index !== -1) {
        this.searches.splice(index, 1);
        this.counts[breed] = (this.counts[breed] || 1) - 1;

        if (this.counts[breed] === 0) {
          delete this.counts[breed];
        }
      }

      this.endSelectMode();
    }
  };

  startSelectMode(search: ImageSearch & AsyncIterable<ImageSearch>) {
    if (this.selectMode) this.endSelectMode();
    this.selectedImageSearch = search;
    this.selectMode = true;
    window.addEventListener('click', this.endSelectMode);
  }

  endSelectMode() {
    this.selectMode = false;
    window.removeEventListener('click', this.endSelectMode);
  }
}
