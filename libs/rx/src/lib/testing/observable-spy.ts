import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { filter, scan, takeUntil, tap } from 'rxjs/operators';

const initialError = Symbol();

export class ObservableSpy<T = unknown, TError = unknown> {
  private readonly _dispose$ = new Subject<void>();
  private _values$ = new BehaviorSubject<Array<T>>([]);
  private _error$ = new BehaviorSubject<TError | typeof initialError>(
    initialError,
  );
  private _complete$ = new BehaviorSubject<boolean>(false);
  private _disposed = false;

  get values(): ReadonlyArray<T> {
    return this._values$.value;
  }

  get error(): TError | undefined {
    return this._error$.value === initialError ? undefined : this._error$.value;
  }

  get complete(): boolean {
    return this._complete$.value;
  }

  get disposed(): boolean {
    return this._disposed;
  }

  constructor(observable: Observable<T>) {
    observable
      .pipe(
        takeUntil(this._dispose$),
        scan((acc: T[], value: T) => [...acc, value], []),
        tap({
          next: (values) => {
            this._values$.next(values);
          },
          error: (error) => {
            this._error$.next(error);
          },
          complete: () => {
            if (!this._disposed) {
              this._complete$.next(true);
            }
          },
        }),
      )
      .subscribe();
  }

  async whenCount(count: number): Promise<void> {
    await firstValueFrom(
      this._values$.pipe(filter((values) => values.length >= count)),
    );
  }

  async whenComplete(): Promise<void> {
    await firstValueFrom(this._complete$.pipe(filter(Boolean)));
  }

  async whenError(): Promise<void> {
    await firstValueFrom(
      this._error$.pipe(filter((error) => error !== initialError)),
    );
  }

  dispose(): void {
    if (!this._disposed) {
      this._disposed = true;
      this._dispose$.next();
      this._dispose$.complete();

      this._values$.complete();
      this._complete$.complete();
      this._error$.complete();
    }
  }
}
