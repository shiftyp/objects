import React, { useEffect } from 'react';

import { useInstance } from '../hooks/useInstance';

class CounterLogic {
  count = 1;

  increment() {
    this.count++;
  }
}

class CounterLogger {
  constructor(
    private logic: CounterLogic &
      AsyncIterable<CounterLogic>
  ) {}

  log(count: number) {
    console.log(`Count is: ${count}`);
  }

  async watch() {
    this.log(this.logic.count);

    for await (const { count } of this.logic) {
      this.log(count);
    }
  }
}

export const Counter: React.FC = () => {
  const [counter, resetCounter] = useInstance(CounterLogic);
  const [logger, resetLogger] = useInstance(
    CounterLogger,
    counter
  );

  useEffect(() => {
    logger.watch();
  }, [logger]);

  return (
    <>
      <button
        onClick={() => {
          counter.increment();
        }}
      >
        Clicked {counter.count} times!
      </button>
      <button
        onClick={() => {
          resetCounter();
          resetLogger();
        }}
      >
        Reset
      </button>
    </>
  );
};
