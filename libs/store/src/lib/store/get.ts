import { Delegate } from '../type/delegate';
import { Store } from './store';

/**
 * Creates a getter function which, once called, returns a value of the given
 * state's property.
 *
 * **Usage example**
 *
 * Declare a getter function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { TaskState } from '@ngry/rx';
 * import { get, Store } from '@ngry/store';
 * import { User } from './user';
 *
 * @Injectable()
 * class UserStore extends Store<TaskState<User>> {
 *   constructor() {
 *     super(TaskState.initial());
 *   }
 *
 *   readonly getResult = get(this, 'result');
 * }
 * ```
 *
 * Call the getter function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { UserStore } from './user.store'
 *
 * @Component()
 * class UserComponent {
 *   constructor(private readonly store: UserStore) {
 *   }
 *
 *   deleteAccount() {
 *     const user = this.store.getResult();
 *     // do smth with user
 *   }
 * }
 * ```
 */
export function get<State extends object, Property extends keyof State>(
  store: Store<State>,
  property: Property,
): Delegate<[], State[Property]> {
  return () => store.snapshot[property];
}
