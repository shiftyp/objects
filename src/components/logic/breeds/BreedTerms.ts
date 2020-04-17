import { Breeds } from "./Breeds";

export class TermError extends Error {
  name = "TermError";
}

export class BreedTerms {
  selected: string | null = null;
  secondarySelected: string | null = null;

  constructor(private breeds: Breeds) {}

  toArray(): string[] {
    this.validate();

    const terms = [this.selected];

    if (this.secondarySelected) {
      terms.push(this.secondarySelected);
    }

    return terms as string[];
  }

  private validate() {
    if (!this.selected) {
      throw new TermError("Primary selection required.");
    }
    if (this.secondaryBreedNames.length && !this.secondarySelected) {
      throw new TermError("Primary selection requires a secondary selection.");
    }
  }

  get breedNames() {
    const { data } = this.breeds;

    return data ? Object.keys(data) : [];
  }

  get secondaryBreedNames(): string[] {
    const { data } = this.breeds;

    return data && this.selected ? data[this.selected] : [];
  }
}
