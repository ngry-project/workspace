import { Delegate } from '../../delegate';

export function memoize<Args extends readonly unknown[], Result>(
  fn: Delegate<Args, Result>,
  makeKey: Delegate<Args, string> = (...args) => JSON.stringify(args),
): Delegate<Args, Result> {
  const cache: Record<string, Result> = Object.create(null);

  return (...args: Args): Result => {
    const key = makeKey(...args);

    if (key in cache) {
      return cache[key];
    } else {
      const result = fn(...args);

      cache[key] = result;

      return result;
    }
  };
}
