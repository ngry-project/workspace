import { Delegate } from '../type/delegate';

/**
 * Limits an update to a specific state property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 *
 * @Injectable()
 * class PersonStore extends Store<Person> {
 *   readonly rename = update(this, property('name'));
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
 *   onNameChange(name: string) {
 *     this.store.rename(name);
 *   }
 * }
 * ```
 *
 * It can be nested to limit update on even more nested property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 *
 * @Injectable()
 * class OfficeStore extends Store<Office> {
 *   readonly setCity = update(this, property('address', property('city')));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { GeoData } from 'geo-lib';
 * import { OfficeStore } from './office.store';
 *
 * @Component()
 * class OfficeComponent {
 *   constructor(private readonly store: OfficeStore) {
 *   }
 *
 *   onLocationChange(data: GeoData) {
 *     this.store.setCity(data.address.city);
 *   }
 * }
 * ```
 *
 * It can be customized to provide a different update logic for property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 * import { Article } from './article';
 *
 * @Injectable()
 * class ArticleStore extends Store<Article> {
 *   readonly clap = update(this, property('claps', claps => claps + 1));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ArticleStore } from './article.store';
 *
 * @Component()
 * class ArticleComponent {
 *   constructor(private readonly store: ArticleStore) {
 *   }
 *
 *   clap() {
 *     this.store.clap();
 *   }
 * }
 * ```
 */
export function property<State extends object, Property extends keyof State>(
  property: Property,
): Delegate<[state: State, value: State[Property]], State>;

/**
 * Limits an update to a specific state property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 *
 * @Injectable()
 * class PersonStore extends Store<Person> {
 *   readonly rename = update(this, property('name'));
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
 *   onNameChange(name: string) {
 *     this.store.rename(name);
 *   }
 * }
 * ```
 *
 * It can be nested to limit update on even more nested property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 *
 * @Injectable()
 * class OfficeStore extends Store<Office> {
 *   readonly setCity = update(this, property('address', property('city')));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { GeoData } from 'geo-lib';
 * import { OfficeStore } from './office.store';
 *
 * @Component()
 * class OfficeComponent {
 *   constructor(private readonly store: OfficeStore) {
 *   }
 *
 *   onLocationChange(data: GeoData) {
 *     this.store.setCity(data.address.city);
 *   }
 * }
 * ```
 *
 * It can be customized to provide a different update logic for property.
 *
 * **Usage example**
 *
 * Create an updater function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, property, update } from '@ngry/store';
 * import { Article } from './article';
 *
 * @Injectable()
 * class ArticleStore extends Store<Article> {
 *   readonly clap = update(this, property('claps', claps => claps + 1));
 * }
 * ```
 *
 * Call the updater function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ArticleStore } from './article.store';
 *
 * @Component()
 * class ArticleComponent {
 *   constructor(private readonly store: ArticleStore) {
 *   }
 *
 *   clap() {
 *     this.store.clap();
 *   }
 * }
 * ```
 */
export function property<
  State extends object,
  Property extends keyof State,
  Args extends readonly unknown[] = [],
>(
  property: Property,
  delegate: Delegate<[State[Property], ...Args], State[Property]>,
): Delegate<[State, ...Args], State>;

export function property<
  State extends object,
  Property extends keyof State,
  Args extends readonly unknown[] = [],
>(
  property: Property,
  delegate?: Delegate<[State[Property], ...Args], State[Property]>,
): Delegate<[State, ...Args], State> {
  return (state: State, ...args: Args): State => ({
    ...state,
    [property]: delegate ? delegate(state[property], ...args) : args[0],
  });
}
