import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { optimize } from '../util/optimize';

export const INITIAL_STATE = new InjectionToken('INITIAL_STATE');

/**
 * Represents a basic store implementation.
 */
@Injectable()
export class Store<State> extends Observable<State> implements OnDestroy {
  private readonly destroy$$ = new Subject<void>();
  private readonly state$$ = new BehaviorSubject<State>(this.initial);

  readonly destroy$ = this.destroy$$.asObservable();

  get snapshot(): State {
    return this.state$$.value;
  }

  constructor(@Inject(INITIAL_STATE) readonly initial: State) {
    super((subscriber) => state$.subscribe(subscriber));

    const state$ = this.state$$.pipe(optimize());
  }

  next(state: State) {
    this.state$$.next(state);
  }

  ngOnDestroy() {
    this.state$$.complete();

    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
