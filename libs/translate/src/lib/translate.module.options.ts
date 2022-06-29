import { DebugOptions } from './debug-options';
import { LanguageOptions } from './language-options';

export interface TranslateModuleOptions {
  readonly language: LanguageOptions;

  readonly debug?: DebugOptions;
}
