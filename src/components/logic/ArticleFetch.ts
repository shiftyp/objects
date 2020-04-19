import { WikiApiFetch } from "./WikiApiFetch";

interface ArticleData {
  href: string;
  title: string;
}

type ArticleResponse = [string, string[], string[], string[]];
export class ArticleFetch extends WikiApiFetch<ArticleData, ArticleResponse> {
  private static cache: Record<string, ArticleData> = {};

  transform = ([search, terms, _, articles]) => ({
    href: articles[0],
    title: terms[0],
  });

  async load(breed: string) {
    if (ArticleFetch.cache[breed]) {
      this.success(ArticleFetch.cache[breed]);
      return;
    }

    const terms = breed.split(" ");

    const possibleTerms = [
      `${breed} dog`,
      `${terms.reverse().join(" ")} dog`,
      `${terms.reverse().join(" ")}`,
      breed,
    ];

    let termCounter = 0;

    do {
      await this.fetch(
        `action=opensearch&search=${encodeURIComponent(
          possibleTerms[termCounter++]
        )}&limit=1&namespace=0`
      );
    } while (
      !this.data?.href &&
      !this.error &&
      termCounter < possibleTerms.length
    );

    if (!this.data?.href) {
      this.failure(new Error(`Couldnt find ${breed} on wikipedia`));
    }

    if (!this.error && this.data) {
      ArticleFetch.cache[breed] = this.data;
    }
  }
}
