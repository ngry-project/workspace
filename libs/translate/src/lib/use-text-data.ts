import { inject, InjectFlags } from '@angular/core';
import { Maybe } from './internal/monad/maybe';
import { TextDataClosure } from './text-data-closure';
import { TEXT_DATA_CLOSURE } from './text-data-closure.token';

/**
 * @internal
 */
export function useTextData(): Maybe<TextDataClosure> {
  return new Maybe(
    inject(TEXT_DATA_CLOSURE, InjectFlags.Optional & InjectFlags.Host),
  );
}
