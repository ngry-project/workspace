import { BundleData } from './bundle-data';

/**
 * @internal
 */
export function mergeBundleData(...dataset: readonly BundleData[]): BundleData {
  return dataset.reduce((result: BundleData, data: BundleData) => {
    return Object.entries(data).reduce(
      (acc: BundleData, [phraseKey, phraseData]): BundleData => {
        if (phraseKey in acc) {
          console.warn(
            'Phrase "%s" with value "%s" has been overridden with value "%s"',
            phraseKey,
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
