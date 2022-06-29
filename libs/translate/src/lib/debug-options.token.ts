import { inject, InjectionToken } from '@angular/core';
import { DebugOptions } from './debug-options';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';

/**
 * Provides debug options.
 * @internal
 */
export const DEBUG_OPTIONS = new InjectionToken<DebugOptions>('DEBUG_OPTIONS', {
  providedIn: 'root',
  factory(): DebugOptions {
    const options = inject(TRANSLATE_MODULE_OPTIONS);

    return options.debug || {};
  },
});
