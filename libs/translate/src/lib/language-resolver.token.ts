import { InjectionToken, inject } from '@angular/core';
import { Language } from './language';
import { LANGUAGE_GUARD } from './language.guard.token';
import { LanguageResolver } from './language-resolver';

/**
 * @internal
 */
export const LANGUAGE_RESOLVER = new InjectionToken<LanguageResolver>(
  'LANGUAGE_RESOLVER',
  {
    providedIn: 'root',
    factory: (guards = inject(LANGUAGE_GUARD)) => {
      return (source: Language): Language => {
        return guards.reduce((language, guard) => guard(language), source);
      };
    },
  },
);
