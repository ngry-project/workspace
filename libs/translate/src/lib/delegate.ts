/**
 * @internal
 */
export type Delegate<Args extends readonly unknown[], R> = (...args: Args) => R;
