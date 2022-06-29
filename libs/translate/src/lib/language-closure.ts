import { Maybe } from './internal/monad/maybe';
import { Phrase } from './phrase';
import { PhraseKey } from './phrase-key';

/**
 * @internal
 */
export interface LanguageClosure {
  (key: PhraseKey): Maybe<Phrase>;
}
