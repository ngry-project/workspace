import { catchError, defer, map, Observable, of, startWith } from 'rxjs';
import { Delegate } from '../internal/delegate';
import { TaskState } from './task-state';

/**
 * Creates a task. Tasks are being executed on subscription.
 * Tasks report their state during execution.
 *
 * **Usage example**
 *
 * ```ts
 * task(() => this.http.get(...)).subscribe();
 * ```
 *
 * @see TaskState
 */
export function task<Result, Error = unknown>(
  executor: Delegate<[], Observable<Result>>,
): Observable<TaskState<Result, Error>> {
  return defer(executor).pipe(
    map((result: Result) => TaskState.complete<Result, Error>(result)),
    catchError((error: Error) => of(TaskState.failed<Result, Error>(error))),
    startWith(TaskState.pending<Result, Error>()),
  );
}
