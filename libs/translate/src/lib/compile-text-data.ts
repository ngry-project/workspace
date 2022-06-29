import { compileLanguage } from './compile-language';
import { Maybe } from './internal/monad/maybe';
import { memoize } from './internal/performance/memoize';
import { Language } from './language';
import { TextData } from './text-data';
import { TextDataClosure } from './text-data-closure';

/**
 * @internal
 */
export function compileTextData(data: TextData): TextDataClosure {
  return memoize((language: Language) => {
    return new Maybe(data[language]).map(compileLanguage);
  });
}
