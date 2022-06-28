import { ChangeDetectorRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Delegate } from '../internal/delegate';
import { useDestroy } from './use-destroy';

/**
 * Creates an internal subscription to provided `Observable`.
 * Unsubscribes automatically when component/pipe/directive destroys.
 * Triggers change detection every time the source `Observable` emits.
 *
 * Think of it as of `async` pipe.
 *
 * **Usage example**
 *
 * ```ts
 * import { useAsync } from '@ngry/rx';
 *
 * @Component()
 * export class ProfileFormComponent {
 *   private readonly getUser = useAsync(this.session.user$);
 *
 *   submit() {
 *     const user = this.getUser();
 *     // ...
 *   }
 * }
 * ```
 *
 * @returns a function that returns the latest emitted value or `undefined` if nothing emitted yet.
 * @see AsyncPipe
 * @see ChangeDetectorRef.markForCheck
 */
export function useAsync<T>(
  source: Observable<T>,
): Delegate<[], T | undefined> {
  const destroy$ = useDestroy();
  const changeDetectorRef = inject(ChangeDetectorRef);

  let latestValue: T | undefined;

  source
    .pipe(
      takeUntil(destroy$),
      tap((value) => (latestValue = value)),
      tap(() => changeDetectorRef.markForCheck()),
    )
    .subscribe();

  return () => latestValue;
}
