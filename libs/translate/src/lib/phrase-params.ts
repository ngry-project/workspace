import { ToString } from './to-string';

/**
 * Represents a phrase interpolation params.
 * @see compileTemplatePhrase
 * @internal
 */
export type PhraseParams = Record<string, ToString | null | undefined>;
