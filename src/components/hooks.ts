import { useReducer, useRef, useMemo } from "react";

export const useObject = <Obj extends Object>(obj: Obj): Obj => {
  const instance = useRef<Obj>(obj);
  const [_, update] = useReducer(() => ({ ...instance.current }), obj);

  const proxy = new Proxy<Obj>({} as Obj, {
    set: (_, prop, value) => {
      instance.current[prop as keyof Obj] = value;
      update();
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

  Object.setPrototypeOf(instance.current, Constructor.prototype);

  const proxy = useMemo(
    () =>
      new Proxy<Obj>({} as Obj, {
        set: (_, prop, value) => {
          instance.current[prop as keyof Obj] = value;
          if (update !== undefined) {
            update();
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

  const [_, update] = useReducer(
    () => ({ ...instance.current }),
    instance.current
  );

  return obj;
};
