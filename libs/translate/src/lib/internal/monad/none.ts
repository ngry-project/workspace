import { Maybe } from './maybe';

export class None<T> implements Maybe<T> {
  isNone(): boolean {
    return true;
  }

  isSome(): boolean {
    return false;
  }

  map<R>(): Maybe<R> {
    return new None();
  }

  flatMap<R>(): Maybe<R> {
    return new None();
  }

  forEach(): Maybe<T> {
    return this;
  }

  orElseRun(fn: () => void): Maybe<T> {
    fn();

    return this;
  }

  orElse(getFallback: () => Maybe<T>): Maybe<T> {
    return getFallback();
  }

  getOrElse(fallback: T): T {
    return fallback;
  }
}
