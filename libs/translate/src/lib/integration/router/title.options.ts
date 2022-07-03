import { Factory } from '../../factory';
import { StandalonePhraseData } from '../../standalone-phrase-data';
import { ParamsResolve } from './params-resolve';

/**
 * @internal
 */
export interface TitleOptions {
  readonly phrase: StandalonePhraseData;
  readonly params?: Factory<ParamsResolve>;
}
