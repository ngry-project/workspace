import { inject, InjectionToken } from '@angular/core';
import { LanguageMapping } from './language-mapping';
import { TRANSLATION_MODULE_OPTIONS } from './translation.module.options.token';

/**
 * @internal
 */
export const LANGUAGE_MAPPING = new InjectionToken<LanguageMapping>(
  'LANGUAGE_MAPPING',
  {
    providedIn: 'root',
    factory(): LanguageMapping {
      const options = inject(TRANSLATION_MODULE_OPTIONS);

      return options.language.mapping ?? {};
    },
  },
);
