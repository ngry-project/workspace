import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngry/store';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Language } from './language';
import { LanguageMapping } from './language-mapping';
import { LANGUAGE_MAPPING } from './language-mapping.token';
import { LanguageResolver } from './language-resolver';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageState } from './language-state';
import { SUPPORTED_LANGUAGES } from './supported-languages.token';

/**
 * Store of language configuration.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStore extends Store<LanguageState> {
  constructor(
    @Inject(LANGUAGE_SOURCE) source: LanguageSource,
    @Inject(LANGUAGE_RESOLVER) resolve: LanguageResolver,
    @Inject(DEFAULT_LANGUAGE) _default: Language,
    @Inject(SUPPORTED_LANGUAGES) supported: ReadonlySet<Language>,
    @Inject(LANGUAGE_MAPPING) mapping: LanguageMapping,
  ) {
    super({
      current: resolve(source.current),
      default: _default,
      supported,
      mapping,
    });
  }
}
