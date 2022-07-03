import { InjectionToken } from '@angular/core';
import { LanguageChangeHandler } from './language-change-handler';

/**
 * @internal
 */
export const LANGUAGE_CHANGE_HANDLER =
  new InjectionToken<LanguageChangeHandler>('LANGUAGE_CHANGE_HANDLER');
