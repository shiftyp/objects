import { ApiFetch } from "./ApiFetch";

export class DogList extends ApiFetch<Record<string, string[]>> {
  selected: string | null = null;

  get list() {
    return this.data ? Object.keys(this.data) : [];
  }

  get secondaryList(): string[] {
    return this.data && this.selected ? this.data[this.selected] : [];
  }

  load() {
    return this.fetch("breeds/list/all");
  }
}
