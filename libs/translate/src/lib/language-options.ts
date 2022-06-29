import { Language } from './language';
import { LanguageChangeHandler } from './language-change-handler';
import { LanguageMapping } from './language-mapping';
import { LanguageSource } from './language-source';

export interface LanguageOptions {
  /**
   * A default language.
   * Used as fallback when the {@link LanguageSource} provides a non-supported one.
   */
  readonly default: Language;

  /**
   * An optional list of supported languages.
   * Using other language will fallback to default one.
   *
   * When omitted, a default language is the only supported one.
   */
  readonly supported?: readonly Language[];

  /**
   * An optional language mapping.
   *
   * When omitted, no mapping will be performed.
   */
  readonly mapping?: LanguageMapping;

  /**
   * A language source.
   * @see BrowserLanguageSource
   * @see FakeLanguageSource
   */
  readonly source: LanguageSource;

  /**
   * An optional language change handler.
   */
  readonly change?: LanguageChangeHandler;
}
