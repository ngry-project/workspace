import { InjectionToken } from '@angular/core';
import { Language } from './language';

/**
 * Provides a set of supported {@link Language}s.
 */
export const SUPPORTED_LANGUAGES = new InjectionToken<ReadonlySet<Language>>(
  'SUPPORTED_LANGUAGES',
);
