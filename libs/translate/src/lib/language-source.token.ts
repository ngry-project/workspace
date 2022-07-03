import { InjectionToken } from '@angular/core';
import { LanguageSource } from './language-source';

/**
 * @internal
 */
export const LANGUAGE_SOURCE = new InjectionToken<LanguageSource>(
  'LANGUAGE_SOURCE',
);
