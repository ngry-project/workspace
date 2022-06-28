import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Returns an `Observable` that emits once on component/directive/pipe/service
 * destroyed and then completes.
 *
 * It simplifies implementation of `OnDestroy` lifecycle hook.
 *
 * **Usage example**
 *
 * ```ts
 * import { useDestroy } from '@ngry/rx';
 *
 * @Component()
 * export class DemoComponent {
 *   private readonly destroy$ = useDestroy();
 *
 *   readonly demo$ = this.demoService.data$.pipe(
 *     takeUntil(this.destroy$),
 *   );
 * }
 * ```
 */
export function useDestroy(): Observable<void> {
  const cdr = inject(ChangeDetectorRef) as ViewRef;
  const destroy$ = new Subject<void>();

  cdr.onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  });

  return destroy$.asObservable();
}
