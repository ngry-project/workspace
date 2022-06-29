import { inject, InjectionToken } from '@angular/core';
import { DebugOptions } from './debug-options';
import { TRANSLATION_MODULE_OPTIONS } from './translation.module.options.token';

/**
 * Provides debug options.
 * @internal
 */
export const DEBUG_OPTIONS = new InjectionToken<DebugOptions>('DEBUG_OPTIONS', {
  providedIn: 'root',
  factory(): DebugOptions {
    const options = inject(TRANSLATION_MODULE_OPTIONS);

    return options.debug || {};
  },
});
