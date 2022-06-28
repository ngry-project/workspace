import { Delegate } from '../type/delegate';

/**
 * Replaces the whole state with a provided one.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, update, to } from '@ngry/store';
 *
 * @Injectable()
 * class CounterStore extends Store<number> {
 *   readonly reset = update(this, to(this.initial));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { CounterStore } from './counter.store';
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
export function to<State>(state: State): Delegate<[], State> {
  return () => state;
}
