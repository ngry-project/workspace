import { DebugOptions } from './debug-options';
import { LanguageOptions } from './language-options';

export interface TranslationModuleOptions {
  readonly language: LanguageOptions;

  readonly debug?: DebugOptions;
}
