import { compilePlainTextPhrase } from './compile-plain-text-phrase';

describe('compilePlainTextPhrase', () => {
  it('should return the text value', () => {
    const phrase = compilePlainTextPhrase('Hello world');

    expect(phrase()).toBe('Hello world');
  });
});
