import { Provider } from '@angular/core';
import { compileTextData } from './compile-text-data';
import { mergeTextData } from './merge-text-data';
import { TextData } from './text-data';
import { TEXT_DATA_CLOSURE } from './text-data-closure.token';

export function TranslateProvider(...data: readonly TextData[]): Provider {
  return {
    provide: TEXT_DATA_CLOSURE,
    useValue: compileTextData(mergeTextData(...data)),
  };
}
