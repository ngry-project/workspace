import { None } from './none';
import { Some } from './some';
import { Maybe } from './maybe';

export function Nullable<T>(value: T | null | undefined): Maybe<T> {
  return value == null ? new None() : new Some(value);
}
