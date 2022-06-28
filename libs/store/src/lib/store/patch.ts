import { Delegate } from '../type/delegate';

/**
 * Allows update delegate to return a partial state.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { patch, Store, update } from '@ngry/store';
 * import { Person } from './person';
 *
 * @Injectable()
 *
 * class PersonStore extends Store<Person> {
 *   constructor() {
 *     super({
 *       name: null,
 *       likes: null,
 *       address: {
 *         country: null,
 *         region: null,
 *         city: null,
 *         street: null,
 *         number: null,
 *       },
 *       tags: [],
 *     });
 *   }
 *
 *   readonly updateAddress = update(this, property('address', patch()));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { PersonStore } from './person.store';
 *
 * @Component()
 * class PersonComponent {
 *   constructor(private readonly store: PersonStore) {
 *   }
 *
 *   setCity(city: string) {
 *     this.store.updateAddress({ city });
 *   }
 * }
 * ```
 */
export function patch<State extends object>(): Delegate<
  [state: State, partial: Partial<State>],
  State
>;

/**
 * Allows update delegate to return a partial state.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { patch, Store, update } from '@ngry/store';
 * import { User } from './user';
 *
 * @Injectable()
 * class UserStore extends Store<User> {
 *   readonly rename = update(
 *     this,
 *     patch((_: User, firstName: string, lastName: string): Partial<User> => {
 *       return {
 *         displayName: `${firstName} ${lastName}`,
 *         firstName,
 *         lastName,
 *       };
 *     }),
 *   );
 *
 *   readonly changeEmail = update(
 *     this,
 *     patch((user: User, email: string): Partial<User> => {
 *       return {
 *         email,
 *         emailVerified: user.email === email ? user.emailVerified : false,
 *       };
 *     }),
 *   );
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { UserStore } from './user.store';
 *
 * @Component()
 * class UserComponent {
 *   constructor(private readonly store: UserStore) {
 *   }
 *
 *   rename(firstName: string, lastName: string) {
 *     this.store.rename(firstName, lastName);
 *   }
 *
 *   changeEmail(email: string) {
 *     this.store.changeEmail(email);
 *   }
 * }
 * ```
 */
export function patch<State extends object, Args extends readonly unknown[]>(
  delegate: Delegate<[State, ...Args], Partial<State>>,
): Delegate<[State, ...Args], State>;

export function patch<State extends object, Args extends readonly unknown[]>(
  delegate?: Delegate<[State, ...Args], Partial<State>>,
): Delegate<[State, ...Args], State> {
  return (state: State, ...args: Args): State => ({
    ...state,
    ...(delegate ? delegate(state, ...args) : (args[0] as Partial<State>)),
  });
}
