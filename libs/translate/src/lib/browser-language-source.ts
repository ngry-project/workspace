import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { select } from '@ngry/store';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Factory } from './factory';
import { Language } from './language';
import { LanguageSource } from './language-source';

/**
 * Uses {@link navigator.language} as a source.
 * Emits changes on {@link Window.onlanguagechange} event.
 *
 * @see navigator.language
 * @see Window.onlanguagechange
 */
export function BrowserLanguageSource(): Factory<LanguageSource> {
  return (initial = inject(DEFAULT_LANGUAGE), document = inject(DOCUMENT)) => {
    const window = document.defaultView;
    const navigator = window?.navigator;

    const language$ = new BehaviorSubject<Language>(
      navigator?.language ?? initial,
    );

    if (window) {
      fromEvent(window, 'languagechange')
        .pipe(select(() => navigator?.language ?? initial))
        .subscribe(language$);
    }

    return {
      get current() {
        return language$.value;
      },
      get changes() {
        return language$.asObservable();
      },
    };
  };
}
