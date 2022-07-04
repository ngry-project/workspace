import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngry/store';
import { Language } from './language';
import { LanguageResolver } from './language-resolver';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';

/**
 * Store of language configuration.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStore extends Store<Language> {
  constructor(
    @Inject(LANGUAGE_SOURCE)
    private readonly _source: LanguageSource,
    @Inject(LANGUAGE_RESOLVER)
    private readonly _resolve: LanguageResolver,
  ) {
    super(_resolve(_source.current));
  }

  override next(language: string): void {
    super.next(this._resolve(language));
  }
}
