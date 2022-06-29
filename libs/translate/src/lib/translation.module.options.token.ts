import { InjectionToken } from '@angular/core';
import { TranslationModuleOptions } from './translation.module.options';

export const TRANSLATION_MODULE_OPTIONS =
  new InjectionToken<TranslationModuleOptions>('TRANSLATION_MODULE_OPTIONS');
