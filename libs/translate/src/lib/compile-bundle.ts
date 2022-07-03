import { BundleClosure } from './bundle-closure';
import { BundleData } from './bundle-data';
import { compilePhrase } from './compile-phrase';
import { Nullable } from './internal/monad/nullable';
import { memoize } from './internal/performance/memoize';
import { PhraseKey } from './phrase-key';

/**
 * @internal
 */
export function compileBundle(data: BundleData): BundleClosure {
  return memoize((phraseKey: PhraseKey) => {
    return Nullable(data[phraseKey]).map(compilePhrase);
  });
}
