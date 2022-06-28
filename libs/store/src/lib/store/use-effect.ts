import { asapScheduler, Observable, scheduled } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Delegate } from '../type/delegate';
import { Store } from './store';

/**
 * Declares a reactive pipeline triggered asynchronously by state changes.
 *
 * > ⚠️This API is experimental and can be changed or removed.
 *
 * **Usage example**
 *
 * Declare effect within the component store:
 *
 * ```ts
 * interface UserEntity {
 *   readonly id: number;
 *   readonly name: string;
 * }
 *
 * interface UserState {
 *   readonly id?: number;
 *   readonly data: TaskState<UserEntity>;
 * }
 *
 * @Component()
 * class UserComponent extends ComponentStore<UserState> {
 *   constructor(route: ActivatedRoute, userService: UserService) {
 *     super({
 *       data: TaskState.initial(),
 *     });
 *
 *     useEffect(this, () =>
 *       route.queryParamMap.pipe(
 *         select((params) => params.get('id')),
 *         filter(isDefined),
 *         map((id) => parseInt(id)),
 *         tap(update(this, property('id'))),
 *       ),
 *     );
 *
 *     useEffect(this, (state$) =>
 *       state$.pipe(
 *         select(({ id }) => id),
 *         filter(isDefined),
 *         switchMap((id) =>
 *           userService.get(id).pipe(
 *             toTask(),
 *             tap(update(this, property('data'))),
 *           ),
 *         ),
 *       ),
 *     );
 *   }
 * }
 * ```
 */
export function useEffect<State>(
  store: Store<State>,
  init: Delegate<[state$: Observable<State>], Observable<unknown>>,
) {
  return init(scheduled(store, asapScheduler))
    .pipe(takeUntil(store.destroy$))
    .subscribe();
}
