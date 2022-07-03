import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DefaultLanguageSource } from './default-language-source';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageModule } from './language.module';
import { TranslateProvider } from './translate.provider';
import { useTranslate } from './use-translate';

@Component({
  viewProviders: [
    TranslateProvider({
      en: {
        'action.save': 'Save',
      },
      uk: {
        'action.save': 'Зберегти',
      },
    }),
  ],
})
class TestComponent {
  readonly translate = useTranslate();
}

describe('useTranslate', () => {
  let component: TestComponent;
  let source: LanguageSource;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    return TestBed.configureTestingModule({
      providers: [
        LanguageModule({
          default: 'en',
          supported: ['en', 'uk'],
          source: DefaultLanguageSource(),
        }),
      ],
    });
  });

  beforeEach(() => {
    source = TestBed.inject(LANGUAGE_SOURCE);
    component = TestBed.createComponent(TestComponent).componentInstance;
  });

  describe('when phrase key is given', () => {
    describe('when phrase is known', () => {
      it('should return a value according to the current language', () => {
        expect(component.translate('action.save')).toBe('Save');

        source.use?.('uk');

        expect(component.translate('action.save')).toBe('Зберегти');
      });
    });

    describe('when phrase is unknown', () => {
      it('should return a phrase key', () => {
        expect(component.translate('action.unknown')).toBe('action.unknown');

        source.use?.('uk');

        expect(component.translate('action.unknown')).toBe('action.unknown');
      });

      it('should print a warning', () => {
        expect(console.warn).toHaveBeenCalledTimes(0);

        component.translate('action.unknown');

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
          'Phrase "%s" is not defined within language "%s"',
          'action.unknown',
          'en',
        );
      });
    });
  });

  describe('when standalone phrase is given', () => {
    it('should return a value according to the current language', () => {
      expect(
        component.translate({
          en: 'Hello',
          uk: 'Привіт',
        }),
      ).toBe('Hello');

      source.use?.('uk');

      expect(
        component.translate({
          en: 'Hello',
          uk: 'Привіт',
        }),
      ).toBe('Привіт');
    });
  });
});
