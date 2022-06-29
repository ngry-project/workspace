import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { select } from '@ngry/store';
import { fromEvent, Subject } from 'rxjs';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Language } from './language';
import { LanguageSource } from './language-source';

/**
 * Uses navigator language.
 * @see navigator.language
 * @see Window.onlanguagechange
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserLanguageSource implements LanguageSource {
  protected readonly default = inject(DEFAULT_LANGUAGE);
  protected readonly document = inject(DOCUMENT);
  protected readonly window = this.document.defaultView;
  protected readonly navigator = this.window?.navigator;

  readonly changes = this.window
    ? fromEvent(this.window, 'languagechange').pipe(select(() => this.current))
    : new Subject<Language>();

  get current(): Language {
    return this.navigator?.language ?? this.default;
  }
}
