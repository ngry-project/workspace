import { compileStandalonePhrase } from './compile-standalone-phrase';
import { Delegate } from './delegate';
import { PhraseParams } from './phrase-params';
import { TranslateInput } from './translate-input';
import { useDebug } from './use-debug';
import { useLanguage } from './use-language';
import { useTextData } from './use-text-data';

export function useTranslate(): Delegate<
  [input: TranslateInput, params?: PhraseParams],
  string
> {
  const debug = useDebug();
  const getLanguage = useLanguage();
  const maybeTextDataClosure = useTextData();

  return (input: TranslateInput, params?: PhraseParams): string => {
    const language = getLanguage();

    if (typeof input === 'string') {
      return maybeTextDataClosure
        .flatMap((textDataClosure) => textDataClosure(language))
        .flatMap((languageClosure) => languageClosure(input))
        .map((phrase) => phrase(params))
        .orElseRun(() =>
          debug(() =>
            console.warn(
              'Phrase "%s" is not defined within language "%s"',
              input,
              language,
            ),
          ),
        )
        .orJust(input);
    } else {
      return compileStandalonePhrase(input)(language)
        .map((phrase) => phrase(params))
        .orElseRun(() =>
          debug(() =>
            console.warn(
              'Phrase "%o" does not include a value for language "%s"',
              input,
              language,
            ),
          ),
        )
        .orJust('');
    }
  };
}
