import { TextData } from './text-data';
import { mergeLanguageData } from './merge-language-data';

/**
 * @internal
 */
export function mergeTextData(...dataset: readonly TextData[]): TextData {
  return dataset.reduce((result: TextData, data: TextData) => {
    return Object.entries(data).reduce(
      (acc: TextData, [language, dictData]): TextData => {
        return {
          ...acc,
          [language]: mergeLanguageData(acc[language] ?? {}, dictData),
        };
      },
      result,
    );
  }, {});
}
