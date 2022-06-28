import { inject } from '@angular/core';
import { Actions } from './actions';
import { DispatchFunction } from './dispatch-function';

/**
 * Creates a function which forwards a given {@link Action}
 * to the {@link Actions} bus.
 */
export function useDispatch(): DispatchFunction {
  const actions = inject(Actions);

  return (action) => actions.next(action);
}
