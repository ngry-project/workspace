import { Factory } from './factory';
import { Language } from './language';
import { LanguageGuard } from './language.guard';
import { LanguageMapping } from './language-mapping';

export function LanguageMappingGuard(
  mapping: LanguageMapping,
): Factory<LanguageGuard> {
  return () => {
    return (language: Language): Language => {
      const candidateLanguages = Object.entries(mapping).reduce(
        (
          candidates: readonly Language[],
          [mappedLanguage, languagePatterns],
        ) => {
          const applicable = languagePatterns.some((languagePattern) => {
            if (typeof languagePattern === 'string') {
              return languagePattern.toLowerCase() === language.toLowerCase();
            } else {
              return languagePattern.test(language);
            }
          });

          if (applicable) {
            return [...candidates, mappedLanguage];
          } else {
            return candidates;
          }
        },
        [],
      );

      if (candidateLanguages.length > 1) {
        console.warn(
          `Found ${
            candidateLanguages.length
          } candidates for language "${language}": ${candidateLanguages
            .map((candidate) => `"${candidate}"`)
            .join(', ')}.\n` +
            `The first one (${candidateLanguages[0]}) will be used.`,
        );

        return candidateLanguages[0];
      } else if (candidateLanguages.length === 1) {
        return candidateLanguages[0];
      } else {
        return language;
      }
    };
  };
}
