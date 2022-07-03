import { Maybe } from './maybe';

export class Some<T> implements Maybe<T> {
  constructor(private readonly value: T) {
    if (value == null) {
      throw new Error('Nullish value is not allowed. Consider using');
    }
  }

  isNone(): boolean {
    return false;
  }

  isSome(): boolean {
    return true;
  }

  map<R>(project: (value: T) => R): Maybe<R> {
    return new Some(project(this.value));
  }

  flatMap<R>(project: (value: T) => Maybe<R>): Maybe<R> {
    return project(this.value);
  }

  orElse(): Maybe<T> {
    return this;
  }

  forEach(delegate: (value: T) => void): Maybe<T> {
    delegate(this.value);

    return this;
  }

  orElseRun(): Maybe<T> {
    return this;
  }

  getOrElse(): T {
    return this.value;
  }
}
