import { inject, InjectionToken } from '@angular/core';
import { Language } from './language';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';

/**
 * Provides a default {@link Language}.
 * @internal
 */
export const DEFAULT_LANGUAGE = new InjectionToken<Language>(
  'DEFAULT_LANGUAGE',
  {
    providedIn: 'root',
    factory(): Language {
      const options = inject(TRANSLATE_MODULE_OPTIONS);

      return options.language.default;
    },
  },
);
