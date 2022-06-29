import { inject, InjectionToken } from '@angular/core';
import { BrowserLanguageSource } from './browser-language-source';
import { LanguageSource } from './language-source';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';

/**
 * @internal
 */
export const LANGUAGE_SOURCE = new InjectionToken<LanguageSource>(
  'LANGUAGE_SOURCE',
  {
    providedIn: 'root',
    factory(): LanguageSource {
      const options = inject(TRANSLATE_MODULE_OPTIONS);

      return options.language.source ?? inject(BrowserLanguageSource);
    },
  },
);
