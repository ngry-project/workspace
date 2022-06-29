import { inject, InjectionToken } from '@angular/core';
import { Language } from './language';
import { TRANSLATION_MODULE_OPTIONS } from './translation.module.options.token';

/**
 * Provides a default {@link Language}.
 * @internal
 */
export const DEFAULT_LANGUAGE = new InjectionToken<Language>(
  'DEFAULT_LANGUAGE',
  {
    providedIn: 'root',
    factory(): Language {
      const options = inject(TRANSLATION_MODULE_OPTIONS);

      return options.language.default;
    },
  },
);
