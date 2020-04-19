import { WikiApiFetch } from "./WikiApiFetch";

export class ArticleFetch extends WikiApiFetch<
  string,
  [string, string[], string[], string[]]
> {
  private static cache: Record<string, string> = {};

  transform = ([search, terms, _, articles]) => articles[0];

  async load(breed: string) {
    if (ArticleFetch.cache[breed]) {
      this.success(ArticleFetch.cache[breed]);
      return;
    }

    await this.fetch(
      `action=opensearch&search=${encodeURIComponent(
        breed
      )}&limit=1&namespace=0`
    );

    if (!this.error && this.data) {
      ArticleFetch.cache[breed] = this.data;
    }
  }
}
