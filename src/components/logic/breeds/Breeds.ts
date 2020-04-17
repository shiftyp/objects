import { ApiFetch } from "../ApiFetch";

type BreedsRecord = Record<string, string[]>;

export class Breeds extends ApiFetch<BreedsRecord> {
  load() {
    return this.fetch("breeds/list/all");
  }
}
