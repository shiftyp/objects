import { Breeds } from "./Breeds";

export class SearchTerms {
  private _selected: string | null = null;

  get selected() {
    return this._selected || "";
  }

  set selected(selected: string) {
    this._selected = selected;
    this.setDefaultSecondarySelected();
  }

  secondarySelected: string | null = null;

  constructor(private breeds: AsyncIterable<Breeds> & Breeds) {
    this.watchBreeds();
  }

  get breedNames() {
    const { data } = this.breeds;

    return data ? Object.keys(data) : [];
  }

  get secondaryBreedNames(): string[] {
    const { data } = this.breeds;

    return data && this.selected ? data[this.selected] : [];
  }

  toArray(): string[] {
    const terms = [this.selected];

    if (this.secondarySelected) {
      terms.push(this.secondarySelected);
    }

    return terms as string[];
  }

  randomize() {
    const { breedNames } = this;

    this.selected = breedNames[Math.floor(Math.random() * breedNames.length)];

    const { secondaryBreedNames } = this;

    this.secondarySelected =
      secondaryBreedNames[
        Math.floor(Math.random() * secondaryBreedNames.length)
      ];
  }

  private setDefaultSelected() {
    this.selected = this.breedNames[0];
  }

  private setDefaultSecondarySelected() {
    this.secondarySelected = this.secondaryBreedNames[0];
  }

  private async watchBreeds() {
    for await (const { data } of this.breeds) {
      if (data) {
        this.setDefaultSelected();
      }
    }
  }
}
