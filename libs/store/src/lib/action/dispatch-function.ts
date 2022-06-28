import { Action } from './action';

/**
 * Dispatches a given {@link Action} via {@link Actions} bus.
 */
export type DispatchFunction = (action: Action) => void;
