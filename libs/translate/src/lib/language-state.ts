import { Language } from './language';
import { LanguageMapping } from './language-mapping';

/**
 * @internal
 */
export interface LanguageState {
  readonly current: Language;
  readonly default: Language;
  readonly supported: ReadonlySet<Language>;
  readonly mapping: LanguageMapping;
}
