import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { LanguageSourceInitializerFactory } from './language-source.initializer.factory';
import { TranslateModuleOptions } from './translate.module.options';
import { TRANSLATE_MODULE_OPTIONS } from './translate.module.options.token';

@NgModule()
export class TranslateModule {
  /**
   * Provides an app-level translation configuration.
   */
  static forRoot(
    factory: () => TranslateModuleOptions,
  ): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule,
      providers: [
        {
          provide: TRANSLATE_MODULE_OPTIONS,
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
