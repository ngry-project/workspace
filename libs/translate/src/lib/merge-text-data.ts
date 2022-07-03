import { mergeBundleData } from './merge-bundle-data';
import { TextData } from './text-data';

/**
 * @internal
 */
export function mergeTextData(...dataset: readonly TextData[]): TextData {
  return dataset.reduce((result: TextData, data: TextData) => {
    return Object.entries(data).reduce(
      (acc: TextData, [language, bundleData]): TextData => {
        return {
          ...acc,
          [language]: mergeBundleData(acc[language] ?? {}, bundleData),
        };
      },
      result,
    );
  }, {});
}
