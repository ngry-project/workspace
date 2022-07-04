import { inject } from '@angular/core';
import { update } from '@ngry/store';
import { filter, map, switchMap, take } from 'rxjs';
import { AppInitializer } from './app-initializer';
import { Factory } from './factory';
import { LANGUAGE_CHANGE_HANDLER } from './language-change-handler.token';
import { LanguageChangeRequest } from './language-change-request';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageStore } from './language-store';

/**
 * @internal
 */
export function LanguageSourceInitializer(): Factory<AppInitializer> {
  return (
    store = inject(LanguageStore),
    source = inject(LANGUAGE_SOURCE),
    handle = inject(LANGUAGE_CHANGE_HANDLER),
    resolve = inject(LANGUAGE_RESOLVER),
  ) => {
    return () => {
      const request$ = source.changes.pipe(
        map(resolve),
        switchMap((target) =>
          store.pipe(
            take(1),
            filter((current) => current !== target),
            map((current): LanguageChangeRequest => ({ target, current })),
          ),
        ),
      );

      const language$ = handle(request$);

      language$.subscribe(update(store));
    };
  };
}
