export class Logger {
  hasLoggedTimes = 0;

  constructor(private iterable: AsyncIterable<any>) {}

  async watch() {
    for await (const data of this.iterable) {
      console.log(`Log ${++this.hasLoggedTimes}:`, data);
    }
  }
}
