import { useArray } from './useArray';
import { useBasicObject } from './useBasicObject';

export function useObject<Obj extends Record<string, any>>(
  obj: Obj
): [AsyncIterable<Obj> & Obj, () => void];
export function useObject<Obj extends Array<any>>(
  Obj: Obj
): [AsyncIterable<Obj> & Obj, () => void];

export function useObject<Obj extends Object | Array<any>>(obj: Obj) {
  if (Array.isArray(obj)) {
    return useArray(obj);
  }
  return useBasicObject<Obj>(obj as Obj);
}
