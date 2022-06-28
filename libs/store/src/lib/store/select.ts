import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { optimize } from '../util/optimize';
import { Selector } from './selector';

/**
 * Selects a value from the state.
 * Emits only distinct values performing deep change detection.
 *
 * **Usage example**
 *
 * ```ts
 * readonly complete$ = this.store.pipe(
 *   select(state => state.isComplete()),
 * );
 * ```
 */
export function select<State, Result>(
  selector: Selector<State, Result>,
): OperatorFunction<State, Result> {
  return (input) => input.pipe(map(selector), optimize());
}
