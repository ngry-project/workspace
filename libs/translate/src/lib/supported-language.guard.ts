import { inject } from '@angular/core';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Factory } from './factory';
import { LanguageGuard } from './language.guard';
import { SUPPORTED_LANGUAGES } from './supported-languages.token';

/**
 * @internal
 */
export function SupportedLanguageGuard(): Factory<LanguageGuard> {
  return () => {
    const _default = inject(DEFAULT_LANGUAGE);
    const supported = inject(SUPPORTED_LANGUAGES);

    return (language) => {
      return supported.has(language) ? language : _default;
    };
  };
}
