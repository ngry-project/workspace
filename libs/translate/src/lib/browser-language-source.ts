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
  return () => {
    const _default = inject(DEFAULT_LANGUAGE);
    const _document = inject(DOCUMENT);
    const _window = _document.defaultView;
    const _navigator = _window?.navigator;

    const language$ = new BehaviorSubject<Language>(
      _navigator?.language ?? _default,
    );

    if (_window) {
      fromEvent(_window, 'languagechange')
        .pipe(select(() => _navigator?.language ?? _default))
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
