import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Factory } from './factory';
import { Language } from './language';
import { LanguageSource } from './language-source';

export function DefaultLanguageSource(): Factory<LanguageSource> {
  return () => {
    const initial = inject(DEFAULT_LANGUAGE);

    const language$ = new BehaviorSubject<Language>(initial);

    return {
      get changes() {
        return language$.asObservable();
      },
      get current() {
        return language$.value;
      },
      use: (language: Language) => language$.next(language),
    };
  };
}
