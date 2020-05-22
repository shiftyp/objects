export class BreedTerms {
  selected: string | null = null;
  secondarySelected: string | null = null;

  toArray() {
    const ret = [this.selected];

    if (this.secondarySelected) {
      ret.push(this.secondarySelected);
    }

    return ret;
  }
}
