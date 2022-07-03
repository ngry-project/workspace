import { InjectionToken } from '@angular/core';
import { Language } from './language';

/**
 * Provides a default {@link Language}.
 * @internal
 */
export const DEFAULT_LANGUAGE = new InjectionToken<Language>(
  'DEFAULT_LANGUAGE',
);
