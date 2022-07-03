import { ToString } from './to-string';

/**
 * Represents a phrase interpolation params.
 * @see Phrase
 * @internal
 */
export type Params = Record<string, ToString | null | undefined>;
