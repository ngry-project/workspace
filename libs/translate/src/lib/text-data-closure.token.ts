import { InjectionToken } from '@angular/core';
import { TextDataClosure } from './text-data-closure';

/**
 * Provides {@link TextDataClosure}.
 * @internal
 */
export const TEXT_DATA_CLOSURE = new InjectionToken<TextDataClosure>(
  'TEXT_DATA_CLOSURE',
);
