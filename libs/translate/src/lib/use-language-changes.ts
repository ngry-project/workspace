import { inject } from '@angular/core';
import { select } from '@ngry/store';
import { Observable } from 'rxjs';
import { Language } from './language';
import { LanguageStore } from './language-store';

export function useLanguageChanges(): Observable<Language> {
  const store = inject(LanguageStore);

  return store.pipe(select((state) => state.current));
}
