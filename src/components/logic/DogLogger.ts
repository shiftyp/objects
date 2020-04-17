import { ImageSearch } from "./ImageSearch";

export class DogLogger {
  hasLoggedTimes = 0;

  constructor(private iterable: AsyncIterable<ImageSearch>) {}

  async watch() {
    let lastLogged = null;

    for await (const { breed } of this.iterable) {
      if (breed && breed !== lastLogged) {
        console.log(`Breed ${++this.hasLoggedTimes}:`, breed);
        lastLogged = breed;
      }
    }
  }
}
