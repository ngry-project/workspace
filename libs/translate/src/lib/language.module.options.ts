import { Factory } from './factory';
import { Language } from './language';
import { LanguageChangeHandler } from './language-change-handler';
import { LanguageGuard } from './language.guard';
import { LanguageSource } from './language-source';

export interface LanguageModuleOptions {
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
   * An optional list of language guards.
   * @see SupportedLanguageGuard
   * @see LanguageMappingGuard
   */
  readonly guards?: readonly Factory<LanguageGuard>[];

  /**
   * An optional language source.
   * @see BrowserLanguageSource
   * @see DefaultLanguageSource
   */
  readonly source?: Factory<LanguageSource>;

  /**
   * An optional language change handler.
   * @see DefaultLanguageChangeHandler
   */
  readonly change?: Factory<LanguageChangeHandler>;
}
