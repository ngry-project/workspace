import { compileStandalonePhrase } from './compile-standalone-phrase';

describe('compileStandalonePhrase', () => {
  const phrase = compileStandalonePhrase({
    en: 'Hello',
    uk: 'Привіт',
  });

  it('should memoize the phrase per language', () => {
    const en1 = phrase('en');
    const en2 = phrase('en');

    expect(en1).toBe(en2);
  });

  it('should produce the phrase value', () => {
    expect(
      phrase('en')
        .map((phrase) => phrase())
        .getOrElse(''),
    ).toBe('Hello');

    expect(
      phrase('uk')
        .map((phrase) => phrase())
        .getOrElse(''),
    ).toBe('Привіт');

    expect(
      phrase('ua')
        .map((phrase) => phrase())
        .isNone(),
    ).toBe(true);
  });
});
