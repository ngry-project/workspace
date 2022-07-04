import { InjectionToken } from '@angular/core';
import { LanguageGuard } from './language.guard';

/**
 * @internal
 */
export const LANGUAGE_GUARD = new InjectionToken<readonly LanguageGuard[]>(
  'LANGUAGE_GUARD',
);
