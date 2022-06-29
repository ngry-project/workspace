import { inject } from '@angular/core';
import { Language } from './language';
import { LanguageStore } from './language-store';

export function useLanguage(): () => Language {
  const store = inject(LanguageStore);

  return () => store.snapshot.current;
}
