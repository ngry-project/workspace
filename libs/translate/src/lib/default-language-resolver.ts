import { inject } from '@angular/core';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Factory } from './factory';
import { Language } from './language';
import { LanguageMapping } from './language-mapping';
import { LanguageResolver } from './language-resolver';
import { SUPPORTED_LANGUAGES } from './supported-languages.token';

/**
 * @internal
 */
export function DefaultLanguageResolver(
  languageMapping: LanguageMapping = {},
): Factory<LanguageResolver> {
  return () => {
    const defaultLanguage = inject(DEFAULT_LANGUAGE);
    const supportedLanguages = inject(SUPPORTED_LANGUAGES);

    return (language: Language): Language => {
      const candidateLanguages = Object.entries(languageMapping).reduce(
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
        if (supportedLanguages.has(language)) {
          return language;
        } else {
          return defaultLanguage;
        }
      }
    };
  };
}
