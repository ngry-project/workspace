import { Injectable } from '@angular/core';
import { NextObserver, Observable, Subject } from 'rxjs';
import { Action } from './action';

/**
 * Represents an action bus.
 */
@Injectable({
  providedIn: 'root',
})
export class Actions
  extends Observable<Action>
  implements NextObserver<Action>
{
  private readonly actions = new Subject<Action>();

  constructor() {
    super((subscriber) => this.actions.subscribe(subscriber));
  }

  next(action: Action) {
    this.actions.next(action);
  }
}
