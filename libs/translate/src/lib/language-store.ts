import { inject, Injectable } from '@angular/core';
import { Store } from '@ngry/store';
import { Language } from './language';
import { LanguageResolver } from './language-resolver';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LANGUAGE_SOURCE } from './language-source.token';

/**
 * Store of language configuration.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStore extends Store<Language> {
  private readonly resolve: LanguageResolver;

  constructor() {
    const source = inject(LANGUAGE_SOURCE);
    const resolve = inject(LANGUAGE_RESOLVER);

    super(resolve(source.current));

    this.resolve = resolve;
  }

  override next(language: string): void {
    super.next(this.resolve(language));
  }
}
