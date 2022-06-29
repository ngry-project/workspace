import { Maybe } from './internal/monad/maybe';
import { Language } from './language';
import { Phrase } from './phrase';

export interface StandalonePhrase {
  (language: Language): Maybe<Phrase>;
}
