import { Delegate } from '../type/delegate';
import { Store } from './store';

/**
 * Creates a reset function which, once called, sets the store's state to its
 * initial value.
 *
 * **Usage example**
 *
 * Declare a reset function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, reset } from '@ngry/store';
 *
 * @Injectable()
 * class CounterStore extends Store<number> {
 *   constructor() {
 *     super(0);
 *   }
 *
 *   readonly reset = reset(this);
 * }
 * ```
 *
 * Call the reset function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { CounterStore } from './counter.store'
 *
 * @Component()
 * class CounterComponent {
 *   constructor(private readonly store: CounterStore) {
 *   }
 *
 *   reset() {
 *     this.store.reset();
 *   }
 * }
 * ```
 */
export function reset<State>(store: Store<State>): Delegate<[], void> {
  return () => store.next(store.initial);
}
