import { ApiFetch } from "./ApiFetch";

export class ImageSearch extends ApiFetch<string> {
  breed: string | null = null;

  search(terms: string[]) {
    this.breed = terms.join(" ");

    return this.fetch(`breed/${terms.join("/")}/images/random`);
  }
}
