import { compilePlainTextPhrase } from './compile-plain-text-phrase';
import { compileTemplatePhrase, isTemplate } from './compile-template-phrase';
import { Phrase } from './phrase';
import { PhraseData } from './phrase-data';

/**
 * @internal
 */
export function compilePhrase(data: PhraseData): Phrase {
  if (typeof data === 'string') {
    if (isTemplate(data)) {
      return compileTemplatePhrase(data);
    } else {
      return compilePlainTextPhrase(data);
    }
  } else {
    return data;
  }
}
