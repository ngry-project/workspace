import { map, Observable } from 'rxjs';
import { Language } from './language';
import { LanguageChangeHandler } from './language-change-handler';
import { LanguageChangeRequest } from './language-change-request';

export const useCurrentLanguage: LanguageChangeHandler = (
  request$: Observable<LanguageChangeRequest>,
): Observable<Language> => {
  return request$.pipe(map(({ current }) => current));
};
