import { compilePhrase } from './compile-phrase';
import { Maybe } from './internal/monad/maybe';
import { memoize } from './internal/performance/memoize';
import { Language } from './language';
import { StandalonePhrase } from './standalone-phrase';
import { StandalonePhraseData } from './standalone-phrase-data';

/**
 * @internal
 */
export function compileStandalonePhrase(
  data: StandalonePhraseData,
): StandalonePhrase {
  return memoize((language: Language) => {
    return new Maybe(data[language]).map(compilePhrase);
  });
}
