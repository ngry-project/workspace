import { inject } from '@angular/core';
import { update } from '@ngry/store';
import { filter, map, withLatestFrom } from 'rxjs';
import { AppInitializer } from './app-initializer';
import { Factory } from './factory';
import { LANGUAGE_CHANGE_HANDLER } from './language-change-handler.token';
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
        withLatestFrom(store),
        filter(([target, current]) => target !== current),
        map(([target, current]) => ({ target, current })),
      );

      const language$ = handle(request$);

      language$.subscribe(update(store));
    };
  };
}
