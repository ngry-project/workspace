/**
 * Determines whether an item matching predicate.
 * @internal
 */
export interface PredicateFunction<T> {
  (item: T): boolean;
}
