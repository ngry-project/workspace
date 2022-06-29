import { compileTemplatePhrase } from './compile-template-phrase';

describe('compileTemplatePhrase', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  it('should interpolate parameter without spaces within name', () => {
    const phrase = compileTemplatePhrase('Hello {{name}}');

    expect(phrase({ name: 'world' })).toBe('Hello world');
  });

  it('should interpolate parameter with spaces within name', () => {
    const phrase = compileTemplatePhrase('Hello {{ name }}');

    expect(phrase({ name: 'world' })).toBe('Hello world');
  });

  it(`should interpolate parameter when it's not present in params`, () => {
    const phrase = compileTemplatePhrase('Hello {{ name }}');

    expect(phrase()).toBe('Hello ');
    expect(phrase({})).toBe('Hello ');
    expect(phrase({ value: 'world' })).toBe('Hello ');
  });

  it(`should interpolate parameter when its value equals to null`, () => {
    const phrase = compileTemplatePhrase('Hello {{ name }}');

    expect(phrase({ name: null })).toBe('Hello ');
  });

  it(`should interpolate parameter when its value equals to undefined`, () => {
    const phrase = compileTemplatePhrase('Hello {{ name }}');

    expect(phrase({ name: undefined })).toBe('Hello ');
  });

  it(`should interpolate parameter when its value is string`, () => {
    const phrase = compileTemplatePhrase('Hello {{ name }}');

    expect(phrase({ name: 'Alex' })).toBe('Hello Alex');
  });

  it(`should interpolate parameter when its value is number`, () => {
    const phrase = compileTemplatePhrase('{{a}} + {{b}} = {{ sum }}');

    expect(phrase({ a: 1, b: 1, sum: 2 })).toBe('1 + 1 = 2');
  });

  it(`should interpolate parameter when its value is boolean`, () => {
    const phrase = compileTemplatePhrase('Checked: {{ checked }}');

    expect(phrase({ checked: true })).toBe('Checked: true');
    expect(phrase({ checked: false })).toBe('Checked: false');
  });
});
