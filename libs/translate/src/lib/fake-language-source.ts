import { Subject } from 'rxjs';
import { Language } from './language';
import { LanguageSource } from './language-source';

export class FakeLanguageSource implements LanguageSource {
  current: Language;
  changes = new Subject<Language>();

  constructor(initial: Language) {
    this.current = initial;
  }

  use(language: Language): void {
    this.current = language;
    this.changes.next(language);
  }
}
