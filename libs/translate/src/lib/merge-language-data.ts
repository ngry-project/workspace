import { LanguageData } from './language-data';

/**
 * @internal
 */
export function mergeLanguageData(
  ...dataset: readonly LanguageData[]
): LanguageData {
  return dataset.reduce((result: LanguageData, data: LanguageData) => {
    return Object.entries(data).reduce(
      (acc: LanguageData, [phraseKey, phraseData]): LanguageData => {
        if (phraseKey in acc) {
          console.warn(
            `Phrase "${phraseKey}" with value "%s" has been overridden with value "%s"`,
            acc[phraseKey],
            phraseData,
          );
        }

        return { ...acc, [phraseKey]: phraseData };
      },
      result,
    );
  }, {});
}
