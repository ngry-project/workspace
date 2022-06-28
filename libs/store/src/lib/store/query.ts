import { Observable } from 'rxjs';
import { Delegate } from '../type/delegate';
import { select } from './select';
import { Selector } from './selector';
import { Store } from './store';

/**
 * Creates a function which, once called, returns a stream of selected distinct
 * values. Function may have any number of arguments to customize the query.
 *
 * **Usage example**
 *
 * Declare a query function within your custom store:
 *
 * ```ts
 * import { Injectable } from '@angular/core';
 * import { Store, query } from '@ngry/store';
 *
 * @Injectable()
 * class TagsStore extends Store<readonly string[]> {
 *   constructor() {
 *     super([]);
 *   }
 *
 *   readonly findCompositeTags = query(this, (tags, separator: string) =>
 *     tags.filter((tag) => tag.includes(separator)),
 *   );
 * }
 * ```
 *
 * Call the query function:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { TagsStore } from './tags.store';
 *
 * @Component()
 * class TagsComponent {
 *   readonly compositeTags$ = this.store.findCompositeTags(':');
 *
 *   constructor(private readonly store: TagsStore) {
 *   }
 * }
 * ```
 */
export function query<State, Result, Args extends readonly unknown[] = []>(
  store: Store<State>,
  selector: Selector<State, Result, Args>,
): Delegate<Args, Observable<Result>> {
  return (...args: Args): Observable<Result> => {
    return store.pipe(select((state) => selector(state, ...args)));
  };
}
