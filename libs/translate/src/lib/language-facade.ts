import { Observable } from 'rxjs';
import { Language } from './language';

export interface LanguageFacade extends Observable<Language> {
  readonly snapshot: Language;
}
