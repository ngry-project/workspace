import { inject, InjectionToken } from '@angular/core';
import { LanguageMapping } from './language-mapping';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';

/**
 * @internal
 */
export const LANGUAGE_MAPPING = new InjectionToken<LanguageMapping>(
  'LANGUAGE_MAPPING',
  {
    providedIn: 'root',
    factory(): LanguageMapping {
      const options = inject(TRANSLATE_MODULE_OPTIONS);

      return options.language.mapping ?? {};
    },
  },
);
