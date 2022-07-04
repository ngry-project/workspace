import { APP_INITIALIZER, Provider } from '@angular/core';
import { DefaultLanguageChangeHandler } from './default-language-change-handler';
import { DefaultLanguageSource } from './default-language-source';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { LANGUAGE_CHANGE_HANDLER } from './language-change-handler.token';
import { LanguageSourceInitializer } from './language-source.initializer';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LANGUAGE_GUARD } from './language.guard.token';
import { LanguageModuleOptions } from './language.module.options';
import { SupportedLanguageGuard } from './supported-language.guard';
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
    ...(options.guards ?? []).map((factory) => ({
      provide: LANGUAGE_GUARD,
      useFactory: factory,
      multi: true,
    })),
    {
      provide: LANGUAGE_GUARD,
      useFactory: SupportedLanguageGuard(),
      multi: true,
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
