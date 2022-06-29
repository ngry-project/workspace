import { inject } from '@angular/core';
import { patch, select, update } from '@ngry/store';
import { filter, map, switchMap, take } from 'rxjs';
import { Language } from './language';
import { LANGUAGE_CHANGE_HANDLER } from './language-change-handler.token';
import { LanguageChangeRequest } from './language-change-request';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageStore } from './language-store';

/**
 * @internal
 */
export function LanguageSourceInitializerFactory(): () => void {
  const store = inject(LanguageStore);
  const source = inject(LANGUAGE_SOURCE);
  const handle = inject(LANGUAGE_CHANGE_HANDLER);
  const resolve = inject(LANGUAGE_RESOLVER);

  return () => {
    const request$ = source.changes.pipe(
      select(resolve),
      switchMap((target) =>
        store.pipe(
          take(1),
          map(({ current }) => current),
          filter((current) => current !== target),
          map((current): LanguageChangeRequest => ({ target, current })),
        ),
      ),
    );

    const language$ = handle(request$);

    language$.subscribe(
      update(
        store,
        patch(({ supported, current }, language: Language) => ({
          current: supported.has(language) ? language : current,
        })),
      ),
    );
  };
}
