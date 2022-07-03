import { APP_INITIALIZER, Provider } from '@angular/core';
import { DefaultLanguageChangeHandler } from './default-language-change-handler';
import { DefaultLanguageResolver } from './default-language-resolver';
import { DefaultLanguageSource } from './default-language-source';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { LANGUAGE_CHANGE_HANDLER } from './language-change-handler.token';
import { LANGUAGE_RESOLVER } from './language-resolver.token';
import { LanguageSourceInitializer } from './language-source.initializer';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageModuleOptions } from './language.module.options';
import { SUPPORTED_LANGUAGES } from './supported-languages.token';

/**
 * Provides a language configuration.
 */
export function LanguageModule(options: LanguageModuleOptions): Provider[] {
  return [
    {
      provide: DEFAULT_LANGUAGE,
      useValue: options.default,
    },
    {
      provide: SUPPORTED_LANGUAGES,
      useValue: new Set(options.supported ?? [options.default]),
    },
    {
      provide: LANGUAGE_RESOLVER,
      useFactory: options.resolver ?? DefaultLanguageResolver(),
    },
    {
      provide: LANGUAGE_SOURCE,
      useFactory: options.source ?? DefaultLanguageSource(),
    },
    {
      provide: LANGUAGE_CHANGE_HANDLER,
      useFactory: options.change ?? DefaultLanguageChangeHandler(),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: LanguageSourceInitializer(),
      multi: true,
    },
  ];
}
