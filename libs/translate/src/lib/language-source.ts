import { Observable } from 'rxjs';
import { Language } from './language';

/**
 * Language source is an abstraction which provides an app
 * with the current language and notifies when it changes.
 */
export interface LanguageSource {
  readonly current: Language;

  readonly changes: Observable<Language>;

  use?(language: Language): void;
}
