import { ImageSearch } from "./ImageSearch";

export class DogLogger {
  hasLoggedTimes = 0;

  constructor(private search: AsyncIterable<ImageSearch>) {}

  async watch() {
    let lastLogged = null;

    for await (const { breed } of this.search) {
      if (breed && breed !== lastLogged) {
        console.log(`Breed ${++this.hasLoggedTimes}:`, breed);
        lastLogged = breed;
      }
    }
  }
}
