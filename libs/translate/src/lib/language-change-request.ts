import { Language } from './language';

export interface LanguageChangeRequest {
  readonly current: Language;
  readonly target: Language;
}
