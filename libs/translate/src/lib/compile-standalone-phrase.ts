import { compilePhrase } from './compile-phrase';
import { Nullable } from './internal/monad/nullable';
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
    return Nullable(data[language]).map(compilePhrase);
  });
}
