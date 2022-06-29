import { Language } from './language';

export interface LanguageResolver {
  (language: Language): Language;
}
