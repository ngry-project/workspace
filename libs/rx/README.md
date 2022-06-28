## Description

RxJS toolkit for Angular development and testing.

## Installation

Using NPM:

```bash
npm i @ngry/rx
```

Using Yarn:

```bash
yarn add @ngry/rx
```

## Documentation

**Table of contents:**

- [Tasking](#tasking)
  - [`toTask` operator](#totask-operator)
  - [`takeTaskResult` operator](#totask-operator)
  - [`takeTaskError` operator](#totask-operator)
- [Filtering](#filtering)
  - [`ofType` operator](#oftype-operator)
  - [`dispatch` operator](#dispatch-operator)
- [Testing](#testing)
  - [`ObservableSpy`](#observablespy)

### Tasking

#### `toTask` operator

Use `toTask` operator to wrap original `Observable<T>` into the `Observable<TaskState<T>>`.

`TaskState` is an immutable structure that indicates async task's `pending` / `complete` / `failed` state and holds
task `result` or `error`.

```ts
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TaskState, toTask } from '@ngry/rx';

export class ExampleService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<TaskState<Entity>> {
    return this.http.get<Entity>('...').pipe(
      toTask(),
    );
  }
}
```

Then in your component:

```ts
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { TaskState, takeTaskError, takeTaskResult } from '@ngry/rx';

@Component({
  selector: 'x-example',
  template: `
  <ng-container *ngIf="state$ | async as state">
    <p *ngIf="state.isPending()">Loading...</p>
    <pre *ngIf="state.isComplete()">{{ state.result | json }}</pre>
  </ng-container>
  `
})
export class ExampleComponment {
  readonly state$ = this.service.get();
  readonly result$ = this.state$.pipe(takeTaskResult());
  readonly error$ = this.state$.pipe(takeTaskError());

  constructor(
    private readonly service: ExampleService,
  ) {}
}
```

### Filtering

#### `ofType` operator

Use `ofType` operator to filter values by certain type(s) (it uses `instanceof` operator to filter values stream).

```ts
export class Load {
  constructor(readonly id: number) {
  }
}

export class Loaded {
  constructor(readonly cart: Cart) {
  }
}

export class CartEffects extends EffectsProvider {
  constructor(
    actions: Actions,
    service: CartService,
  ) {
    super([
      actions.pipe(
        // 👇 Bypass only actions of type Load
        ofType(Load),
        switchMap(action => service.load(action.id)),
        map(cart => new Loaded(cart)),
      ),
    ]);
  }
}
```

#### `dispatch` operator

Use `dispatch` operator to control whether values must pass through this point of stream or not.

Open mode

```ts
from([1, 2, 3])
  .pipe(dispatch(true))
  .subscribe(console.log);
// Prints 1, 2, 3 then completes
```

Closed mode

```ts
from([1, 2, 3])
  .pipe(dispatch(false))
  .subscribe(console.log);
// Ignores values, thus prints nothing and completes
```

### Testing

#### `ObservableSpy`

`ObservableSpy` tracks changes in `Observable` like emitted values, completion and failure for further
analysis. `Observable`s testing becomes easier.

Test emitted values:

```ts
import { from } from 'rxjs';
import { ObservableSpy } from '@ngry/rx';

test('emitted values', () => {
  const spy = new ObservableSpy<number>(from([1, 3, 5]));

  expect(spy.values).toEqual([1, 3, 5]);
});
```

Test completion:

```ts
import { empty } from 'rxjs';
import { ObservableSpy } from '@ngry/rx';

test('completion', () => {
  const spy = new ObservableSpy<number>(empty());

  expect(spy.complete).toBe(true);
});
```

Test error:

```ts
import { throwError } from 'rxjs';
import { ObservableSpy } from '@ngry/rx';

test('error', () => {
  const spy = new ObservableSpy<number>(throwError('Something went wrong'));

  expect(spy.error).toBe('Something went wrong');
});
```

## License

MIT
