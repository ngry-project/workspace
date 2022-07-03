import { Maybe } from './internal/monad/maybe';
import { Language } from './language';
import { BundleClosure } from './bundle-closure';

/**
 * @internal
 */
export interface TextDataClosure {
  (language: Language): Maybe<BundleClosure>;
}
