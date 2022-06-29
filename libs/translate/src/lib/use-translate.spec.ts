import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FakeLanguageSource } from './fake-language-source';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { TranslateProvider } from './translate.provider';
import { TranslationModule } from './translation.module';
import { useTranslate } from './use-translate';

@Component({
  selector: 'ngry-test',
  standalone: true,
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
    return TestBed.configureTestingModule({
      imports: [
        TranslationModule.forRoot(() => ({
          language: {
            default: 'en',
            supported: ['en', 'uk'],
            source: new FakeLanguageSource('en'),
          },
        })),
      ],
    });
  });

  beforeEach(() => {
    source = TestBed.inject(LANGUAGE_SOURCE);
    component = TestBed.createComponent(TestComponent).componentInstance;
  });

  describe('when phrase key is given', () => {
    it('should return a value according to the current language', () => {
      expect(component.translate('action.save')).toBe('Save');

      source.use?.('uk');

      expect(component.translate('action.save')).toBe('Зберегти');
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
