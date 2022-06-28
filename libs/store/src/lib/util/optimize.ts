import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { isEqual } from './is-equal';

/**
 * @internal
 */
export function optimize<T>(): OperatorFunction<T, T> {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      distinctUntilChanged(isEqual),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      }),
    );
}
