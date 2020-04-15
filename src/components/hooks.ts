import { useState, useRef, useMemo } from "react";

export const useObject = <Obj extends Object>(obj: Obj): Obj => {
  const instance = useRef<Obj>(obj);
  const [state, setState] = useState<Obj>(instance.current);

  Object.assign(instance.current, state);

  const proxy = new Proxy<Obj>({} as Obj, {
    set: (_, prop, value) => {
      instance.current[prop as keyof Obj] = value;
      setState({ ...instance.current });
      return true;
    },
    get: (_, prop, reciever) => {
      return instance.current[prop as keyof Obj];
    },
    ownKeys: () => {
      return Reflect.ownKeys(instance.current);
    },
  });

  return proxy as Obj;
};

export const useClass = <Obj extends Object>(Constructor: {
  new (): Obj;
}): Obj => {
  const instance = useRef<Obj>({} as Obj);
  const update = useRef<number>();

  Object.setPrototypeOf(instance.current, Constructor.prototype);

  const proxy = useMemo(
    () =>
      new Proxy<Obj>({} as Obj, {
        set: (_, prop, value) => {
          instance.current[prop as keyof Obj] = value;
          if (setState !== undefined) {
            clearTimeout(update.current);
            update.current = setTimeout(() => {
              setState({ ...instance.current });
            });
          }
          return true;
        },
        get: (_, prop, reciever) => {
          return instance.current[prop as keyof Obj];
        },
        ownKeys: () => {
          return Reflect.ownKeys(instance.current);
        },
      }),
    [instance]
  );

  const obj = useMemo(() => Constructor.apply(proxy) as unknown, [
    Constructor,
    proxy,
  ]) as Obj;

  const [state, setState] = useState<Obj>(obj);

  Object.assign(instance.current, state);

  return obj;
};
