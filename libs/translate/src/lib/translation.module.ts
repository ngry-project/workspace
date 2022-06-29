import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { LanguageSourceInitializerFactory } from './language-source.initializer.factory';
import { TranslationModuleOptions } from './translation.module.options';
import { TRANSLATION_MODULE_OPTIONS } from './translation.module.options.token';

@NgModule()
export class TranslationModule {
  /**
   * Provides an app-level translation configuration.
   */
  static forRoot(
    factory: () => TranslationModuleOptions,
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        {
          provide: TRANSLATION_MODULE_OPTIONS,
          useFactory: factory,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: LanguageSourceInitializerFactory,
          multi: true,
        },
      ],
    };
  }
}
