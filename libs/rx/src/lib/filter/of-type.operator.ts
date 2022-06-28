import { Type } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Selects values matching type(s).
 * @param types Allowed types
 * @since 11.3.0
 * @author Alex Chugaev
 */
export function ofType<I extends object, O extends I>(
  ...types: Array<Type<O>>
): OperatorFunction<I, O> {
  return (source: Observable<I>): Observable<O> => {
    const isInstanceOf = (object: object): object is O => {
      return !!types.find((type) => object instanceof type);
    };

    return source.pipe(filter(isInstanceOf));
  };
}
