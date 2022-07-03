import { compileBundle } from './compile-bundle';
import { Nullable } from './internal/monad/nullable';
import { memoize } from './internal/performance/memoize';
import { Language } from './language';
import { TextData } from './text-data';
import { TextDataClosure } from './text-data-closure';

/**
 * @internal
 */
export function compileTextData(data: TextData): TextDataClosure {
  return memoize((language: Language) => {
    return Nullable(data[language]).map(compileBundle);
  });
}
