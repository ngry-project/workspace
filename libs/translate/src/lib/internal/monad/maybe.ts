export interface Maybe<T> {
  // inspect

  isNone(): boolean;
  isSome(): boolean;

  // chain
  map<R>(project: (value: T) => R): Maybe<R>;
  flatMap<R>(project: (value: T) => Maybe<R>): Maybe<R>;
  forEach(fn: (value: T) => void): Maybe<T>;

  // alternative
  orElse(getFallback: () => Maybe<T>): Maybe<T>;
  orElseRun(fn: () => void): Maybe<T>;

  // access
  getOrElse(fallback: T): T;
}
