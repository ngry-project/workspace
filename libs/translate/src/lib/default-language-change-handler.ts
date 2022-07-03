import { map, Observable } from 'rxjs';
import { Factory } from './factory';
import { Language } from './language';
import { LanguageChangeHandler } from './language-change-handler';
import { LanguageChangeRequest } from './language-change-request';

/**
 * @internal
 */
export function DefaultLanguageChangeHandler(): Factory<LanguageChangeHandler> {
  return () => {
    return (
      request$: Observable<LanguageChangeRequest>,
    ): Observable<Language> => {
      return request$.pipe(map(({ target }) => target));
    };
  };
}
