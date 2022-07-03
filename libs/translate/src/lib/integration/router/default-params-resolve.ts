import { of } from 'rxjs';
import { Factory } from '../../factory';
import { ParamsResolve } from './params-resolve';

/**
 * @internal
 */
export function DefaultParamsResolve(): Factory<ParamsResolve> {
  return () => () => of({});
}
