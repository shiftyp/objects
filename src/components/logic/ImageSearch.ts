import { ApiFetch } from "./ApiFetch";
import { BreedTerms } from "./breeds/BreedTerms";

export class ImageSearch extends ApiFetch<string> {
  breed: string | null = null;

  constructor(private terms: BreedTerms) {
    super();
  }

  search() {
    let terms = null;

    try {
      terms = this.terms.toArray();
    } catch (error) {
      this.failure(error);
    }

    if (terms !== null) {
      this.breed = terms.join(" ");

      return this.fetch(`breed/${terms.join("/")}/images/random`);
    }
  }
}
