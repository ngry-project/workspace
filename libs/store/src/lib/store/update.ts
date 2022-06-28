import { Delegate } from '../type/delegate';
import { Store } from './store';

/**
 * Creates a state update function which, once called,
 * replaces store's state with a new value.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, update } from '@ngry/store';
 * import { User } from './user';
 *
 * @Injectable()
 * class UserStore extends Store<User> {
 *   readonly rename = update(
 *     this,
 *     (user: User, firstName: string, lastName: string): User => {
 *       return {
 *         ...user,
 *         displayName: `${firstName} ${lastName}`,
 *         firstName,
 *         lastName,
 *       };
 *     },
 *   );
 *
 *   readonly changeEmail = update(
 *     this,
 *     (user: User, email: string): User => {
 *       return {
 *         ...user,
 *         email,
 *         emailVerified: user.email === email ? user.emailVerified : false,
 *       };
 *     },
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
export function update<State>(
  store: Store<State>,
): Delegate<[state: State], void>;

/**
 * Creates a state update function which, once called, replaces store's state with a new value.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, update } from '@ngry/store';
 * import { User } from './user';
 *
 * @Injectable()
 * class UserStore extends Store<User> {
 *   readonly rename = update(
 *     this,
 *     (user: User, firstName: string, lastName: string): User => {
 *       return {
 *         ...user,
 *         displayName: `${firstName} ${lastName}`,
 *         firstName,
 *         lastName,
 *       };
 *     },
 *   );
 *
 *   readonly changeEmail = update(
 *     this,
 *     (user: User, email: string): User => {
 *       return {
 *         ...user,
 *         email,
 *         emailVerified: user.email === email ? user.emailVerified : false,
 *       };
 *     },
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
export function update<State, Args extends readonly unknown[]>(
  store: Store<State>,
  delegate: Delegate<[State, ...Args], State>,
): Delegate<Args, void>;

export function update<State, Args extends readonly unknown[]>(
  store: Store<State>,
  delegate?: Delegate<[State, ...Args], State>,
): Delegate<Args, void> {
  return (...args: Args) => {
    store.next(
      delegate ? delegate(store.snapshot, ...args) : (args[0] as State),
    );
  };
}
