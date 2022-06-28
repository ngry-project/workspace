import { Observable, Subject } from 'rxjs';
import { Delegate } from '../type/delegate';

/**
 * Creates a function which, once called, executes a reactive pipeline with side effects;
 * its arguments are being pushed to this pipeline as a tuple.
 *
 * **Usage example**
 *
 * Declare a side effects function within your custom store:
 *
 * ```ts
 * import { Injectable, Input, OnInit } from '@angular/core';
 * import { Store, fn, update } from '@ngry/store';
 * import { TaskState, toTask } from '@ngry/rx';
 * import { switchMap, tap } from 'rxjs/operators'
 * import { AccountService } from './account.service';
 * import { Account } from './account';
 *
 * @Injectable()
 * class AccountStore extends Store<TaskState<Account>> {
 *   constructor(private readonly accounts: AccountService) {
 *     super(TaskState.initial());
 *   }
 *
 *   readonly load = fn<[id: string]>((args$) =>
 *     args$.pipe(
 *       switchMap(([id]) => this.accounts.get(id).pipe(toTask())),
 *       tap(update(this)),
 *     ),
 *   );
 * }
 * ```
 *
 * Call the side effects function:
 *
 * ```ts
 * import { Component, Input, OnInit } from '@angular/core';
 * import { AccountStore } from './account.store';
 *
 * @Component()
 * class AccountComponent implements OnInit {
 *   @Input()
 *   id: string;
 *
 *   constructor(private readonly store: AccountStore) {
 *   }
 *
 *   ngOnInit() {
 *     this.store.load(this.id);
 *   }
 * }
 * ```
 */
export function fn<Args extends readonly unknown[] = []>(
  init: (args$: Observable<Args>) => Observable<unknown>,
): Delegate<Args, void> {
  const args$ = new Subject<Args>();

  init(args$).subscribe();

  return (...args: Args) => {
    args$.next(args);
  };
}
