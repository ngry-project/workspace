import { Provider } from '@angular/core';
import { compileTextData } from './compile-text-data';
import { memoize } from './internal/performance/memoize';
import { mergeTextData } from './merge-text-data';
import { TextData } from './text-data';
import { TextDataClosure } from './text-data-closure';
import { TEXT_DATA_CLOSURE } from './text-data-closure.token';

export function TranslateProvider(...dataset: readonly TextData[]): Provider {
  return {
    provide: TEXT_DATA_CLOSURE,
    useFactory: memoize((): TextDataClosure => {
      return compileTextData(mergeTextData(...dataset));
    }),
  };
}
