import { Maybe } from './internal/monad/maybe';
import { Language } from './language';
import { LanguageClosure } from './language-closure';

/**
 * @internal
 */
export interface TextDataClosure {
  (language: Language): Maybe<LanguageClosure>;
}
