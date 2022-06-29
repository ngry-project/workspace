import { compilePhrase } from './compile-phrase';
import { Maybe } from './internal/monad/maybe';
import { memoize } from './internal/performance/memoize';
import { LanguageClosure } from './language-closure';
import { LanguageData } from './language-data';
import { PhraseKey } from './phrase-key';

/**
 * @internal
 */
export function compileLanguage(data: LanguageData): LanguageClosure {
  return memoize((phraseKey: PhraseKey) => {
    return new Maybe(data[phraseKey]).map(compilePhrase);
  });
}
