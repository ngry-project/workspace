import { InjectionToken } from '@angular/core';
import { LanguageResolver as LanguageResolver } from './language-resolver';

/**
 * @internal
 */
export const LANGUAGE_RESOLVER = new InjectionToken<LanguageResolver>(
  'LANGUAGE_RESOLVER',
);
