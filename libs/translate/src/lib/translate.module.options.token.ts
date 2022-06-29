import { InjectionToken } from '@angular/core';
import { TranslateModuleOptions } from './translate.module.options';

export const TRANSLATE_MODULE_OPTIONS =
  new InjectionToken<TranslateModuleOptions>('TRANSLATE_MODULE_OPTIONS');
