import { inject } from '@angular/core';
import { DEBUG_OPTIONS } from './debug-options.token';
import { DebugFunction } from './debug-function';

/**
 * @internal
 */
export function useDebug(): DebugFunction {
  const options = inject(DEBUG_OPTIONS);

  return (execute: () => void): void => {
    if (options.enabled) {
      execute();
    }
  };
}
