import { useRef, useMemo } from 'react';
import { Stateful, Subscription } from '@objects/types';

export const useBehavior = <Deps extends Stateful<{}>[]>(
  cb: (...deps: Deps) => Subscription | undefined,
  ...deps: Deps
) => {
  let subscriptions = useRef<(Subscription | undefined)[]>([]);

  const unsubscribe = () => {
    subscriptions.current.forEach((subscription) =>
      subscription?.unsubscribe()
    );
  };

  const subscribeToComplete = () => {
    for (const dep of deps) {
      if (dep) {
        subscriptions.current.push(
          dep[Symbol.observable]().subscribe(null, null, reset)
        );
      }
    }
  };

  const runCb = () => {
    subscriptions.current.push(cb(...deps));
  };

  const reset = () => {
    unsubscribe();
    subscribeToComplete();
    runCb();
  };

  useMemo(reset, deps);
};
