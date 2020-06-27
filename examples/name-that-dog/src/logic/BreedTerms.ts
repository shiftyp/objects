export class BreedTerms {
  selected: string | null = null;
  secondarySelected: string | null = null;

  toArray() {
    if (this.selected === null) {
      return [];
    }

    const ret = [this.selected];

    if (this.secondarySelected) {
      ret.push(this.secondarySelected);
    }

    return ret;
  }
}
