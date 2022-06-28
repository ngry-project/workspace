/**
 * Represents a selector function.
 * Selectors are being used to reduce a bigger value to some more specific one.
 */
export interface Selector<State, Result, Args extends readonly unknown[] = []> {
  (state: State, ...args: Args): Result;
}
