export class Maybe<T> {
  constructor(private readonly value?: T | null | undefined) {}

  isNone(): boolean {
    return this.value == null;
  }

  isJust(): boolean {
    return this.value != null;
  }

  map<R>(project: (value: T) => R): Maybe<R> {
    if (this.value != null) {
      return new Maybe(project(this.value));
    } else {
      return new Maybe();
    }
  }

  flatMap<R>(project: (value: T) => Maybe<R>): Maybe<R> {
    if (this.value != null) {
      return project(this.value);
    } else {
      return new Maybe();
    }
  }

  catchMap(fn: () => Maybe<T>): Maybe<T> {
    if (this.isNone()) {
      return fn();
    }

    return this;
  }

  forEach(fn: (value: T) => void): this {
    if (this.value != null) {
      fn(this.value);
    }

    return this;
  }

  orElseRun(fn: () => void): this {
    if (this.isNone()) {
      fn();
    }

    return this;
  }

  orJust(value: T): T {
    if (this.value != null) {
      return this.value;
    } else {
      return value;
    }
  }
}
