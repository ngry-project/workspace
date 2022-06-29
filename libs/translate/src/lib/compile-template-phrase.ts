import { PhraseParams } from './phrase-params';
import { Phrase } from './phrase';

const ENTRY = /{{\s*(\w+)\s*}}/g;

/**
 * @internal
 */
export function isTemplate(phrase: string): boolean {
  return ENTRY.test(phrase);
}

/**
 * @internal
 */
export function compileTemplatePhrase(template: string): Phrase {
  return (params: PhraseParams = {}): string => {
    return template.replace(ENTRY, (_: string, parameter: string) => {
      if (params[parameter] == null) {
        console.warn(
          `Parameter "${parameter}" of phrase "${template}" is nullable`,
        );

        return '';
      } else {
        return String(params[parameter]);
      }
    });
  };
}
