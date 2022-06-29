import { Phrase } from './phrase';

/**
 * @internal
 */
export function compilePlainTextPhrase(text: string): Phrase {
  return () => text;
}
