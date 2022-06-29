import { Maybe } from './maybe';

export function None<T>(): Maybe<T> {
  return new Maybe();
}
