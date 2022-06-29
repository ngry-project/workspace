import { PhraseParams } from './phrase-params';

export interface Phrase {
  (params?: PhraseParams): string;
}
