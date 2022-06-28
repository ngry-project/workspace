/**
 * Function definition which allows to specify arguments and type of return value.
 * @internal
 */
export interface Delegate<TArgs extends readonly unknown[], TResult> {
  (...args: TArgs): TResult;
}
