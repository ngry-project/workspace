import { Provider } from '@angular/core';
import { compileStandalonePhrase } from '../../compile-standalone-phrase';
import { DefaultParamsResolve } from './default-params-resolve';
import { ROUTE_TITLE_PARAMS } from './route-title-params.token';
import { ROUTE_TITLE_PHRASE } from './route-title-phrase.token';
import { TitleOptions } from './title.options';
import { TitleResolve } from './title.resolve';

/**
 * Creates a route title providers.
 *
 * @returns route title providers
 */
export function TitleProvider({ phrase, params }: TitleOptions): Provider[] {
  return [
    TitleResolve,
    {
      provide: ROUTE_TITLE_PHRASE,
      useValue: compileStandalonePhrase(phrase),
    },
    {
      provide: ROUTE_TITLE_PARAMS,
      useFactory: params ?? DefaultParamsResolve(),
    },
  ];
}
