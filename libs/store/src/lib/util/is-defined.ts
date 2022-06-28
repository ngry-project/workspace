/**
 * @internal
 */
export type IsDefined<T> = T extends null | undefined ? never : T;

/**
 * @internal
 */
export function isDefined<T>(value: T): value is IsDefined<T> {
  return value != null;
}
