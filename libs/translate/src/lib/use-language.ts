import { inject } from '@angular/core';
import { LanguageStore } from './language-store';
import { LanguageFacade } from './language-facade';

export function useLanguage(): LanguageFacade {
  return inject(LanguageStore);
}
