import { InjectionToken } from '@angular/core';
import { ParamsResolve } from './params-resolve';

/**
 * @internal
 */
export const ROUTE_TITLE_PARAMS = new InjectionToken<ParamsResolve>(
  'ROUTE_TITLE_PARAMS',
);
