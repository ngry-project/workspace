import { Maybe } from './internal/monad/maybe';
import { Phrase } from './phrase';
import { PhraseKey } from './phrase-key';

/**
 * @internal
 */
export interface BundleClosure {
  (key: PhraseKey): Maybe<Phrase>;
}
