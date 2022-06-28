/**
 * Compares two items.
 * @internal
 */
export interface CompareFunction<T> {
  (a: T, b: T): number;
}
