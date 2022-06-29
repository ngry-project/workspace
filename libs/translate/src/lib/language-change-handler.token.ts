import { inject, InjectionToken } from '@angular/core';
import { LanguageChangeHandler } from './language-change-handler';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';
import { useTargetLanguage } from './use-target-language';

/**
 * @internal
 */
export const LANGUAGE_CHANGE_HANDLER =
  new InjectionToken<LanguageChangeHandler>('LANGUAGE_CHANGE_HANDLER', {
    providedIn: 'root',
    factory: (): LanguageChangeHandler => {
      const options = inject(TRANSLATE_MODULE_OPTIONS);

      return options.language.change ?? useTargetLanguage;
    },
  });
