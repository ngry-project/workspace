import { inject, InjectionToken } from '@angular/core';
import { Language } from './language';
import { TRANSLATION_MODULE_OPTIONS } from './translation.module.options.token';

/**
 * Provides a set of supported {@link Language}s.
 */
export const SUPPORTED_LANGUAGES = new InjectionToken<ReadonlySet<Language>>(
  'SUPPORTED_LANGUAGES',
  {
    providedIn: 'root',
    factory(): ReadonlySet<Language> {
      const options = inject(TRANSLATION_MODULE_OPTIONS);

      return new Set(options.language.supported ?? [options.language.default]);
    },
  },
);
