import { compileStandalonePhrase } from './compile-standalone-phrase';
import { Params } from './params';
import { TranslateInput } from './translate-input';
import { useLanguage } from './use-language';
import { useTextData } from './use-text-data';

export function useTranslate() {
  const language = useLanguage();
  const maybeTextDataClosure = useTextData();

  return (input: TranslateInput, params?: Params): string => {
    if (typeof input === 'string') {
      return maybeTextDataClosure
        .flatMap((closure) => closure(language.snapshot))
        .flatMap((closure) => closure(input))
        .map((phrase) => phrase(params))
        .orElseRun(() =>
          console.warn(
            'Phrase "%s" is not defined within language "%s"',
            input,
            language.snapshot,
          ),
        )
        .getOrElse(input);
    } else {
      return compileStandalonePhrase(input)(language.snapshot)
        .map((phrase) => phrase(params))
        .orElseRun(() =>
          console.warn(
            'Phrase "%o" does not include a value for language "%s"',
            input,
            language.snapshot,
          ),
        )
        .getOrElse('');
    }
  };
}
