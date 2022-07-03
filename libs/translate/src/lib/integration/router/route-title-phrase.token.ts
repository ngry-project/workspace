import { InjectionToken } from '@angular/core';
import { StandalonePhrase } from '../../standalone-phrase';

/**
 * @internal
 */
export const ROUTE_TITLE_PHRASE = new InjectionToken<StandalonePhrase>(
  'ROUTE_TITLE_PHRASE',
);
