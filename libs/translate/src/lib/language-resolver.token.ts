import { inject, InjectionToken } from '@angular/core';
import { DEFAULT_LANGUAGE } from './default-language.token';
import { Language } from './language';
import { LANGUAGE_MAPPING } from './language-mapping.token';
import { LanguageResolver as LanguageResolver } from './language-resolver';
import { SUPPORTED_LANGUAGES } from './supported-languages.token';

/**
 * @internal
 */
export const LANGUAGE_RESOLVER = new InjectionToken<LanguageResolver>(
  'LANGUAGE_RESOLVER',
  {
    providedIn: 'root',
    factory(): LanguageResolver {
      const defaultLanguage = inject(DEFAULT_LANGUAGE);
      const supportedLanguages = inject(SUPPORTED_LANGUAGES);
      const languageMapping = inject(LANGUAGE_MAPPING);

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
    },
  },
);
