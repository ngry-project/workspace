import { compilePhrase } from './compile-phrase';

describe('compilePhrase', () => {
  it('should return TextPhrase when phrase data is string without placeholders', () => {
    const phrase = compilePhrase('Hello world');

    expect(phrase()).toBe('Hello world');
  });

  it('should return TemplatePhrase when phrase data is string with placeholders', () => {
    const phrase = compilePhrase('Hello {{name}}');

    expect(phrase({ name: 'world' })).toBe('Hello world');
    expect(phrase({ name: 'folks' })).toBe('Hello folks');
  });
});
