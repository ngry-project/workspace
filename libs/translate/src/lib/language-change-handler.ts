import { Observable } from 'rxjs';
import { Language } from './language';
import { LanguageChangeRequest } from './language-change-request';

/**
 * Handles {@link LanguageChangeRequest}s, decides what's the next language should be.
 */
export interface LanguageChangeHandler {
  (request$: Observable<LanguageChangeRequest>): Observable<Language>;
}
