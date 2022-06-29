import { Maybe } from './maybe';

export function Just<T>(value: T): Maybe<T> {
  return new Maybe(value);
}
