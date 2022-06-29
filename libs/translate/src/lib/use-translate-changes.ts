import { select } from '@ngry/store';
import { Observable } from 'rxjs';
import { Delegate } from './delegate';
import { PhraseParams } from './phrase-params';
import { TranslateInput } from './translate-input';
import { useLanguageChanges } from './use-language-changes';
import { useTranslate } from './use-translate';

export function useTranslateChanges(): Delegate<
  [input: TranslateInput, params?: PhraseParams],
  Observable<string>
> {
  const language$ = useLanguageChanges();
  const translate = useTranslate();

  return (input: TranslateInput, params?: PhraseParams): Observable<string> => {
    return language$.pipe(select(() => translate(input, params)));
  };
}
