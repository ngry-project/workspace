import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { FakeLanguageSource } from './fake-language-source';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { TranslateProvider } from './translate.provider';
import { TranslationModule } from './translation.module';
import { useTranslateChanges } from './use-translate-changes';

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
  readonly translate = useTranslateChanges();
}

describe('useTranslateChanges', () => {
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
    }).compileComponents();
  });

  beforeEach(() => {
    source = TestBed.inject(LANGUAGE_SOURCE);
    component = TestBed.createComponent(TestComponent).componentInstance;
  });

  describe('when phrase key is given', () => {
    let valueSpy: ObservableSpy<string>;

    beforeEach(() => {
      valueSpy = new ObservableSpy(component.translate('action.save'));
    });

    beforeEach(() => {
      source.use?.('uk');
    });

    it('should emit a value according to the current language', () => {
      expect(valueSpy.values).toStrictEqual(['Save', 'Зберегти']);
    });
  });

  describe('when standalone phrase is given', () => {
    let valueSpy: ObservableSpy<string>;

    beforeEach(() => {
      valueSpy = new ObservableSpy(
        component.translate({
          en: 'Hello',
          uk: 'Привіт',
        }),
      );
    });

    beforeEach(() => {
      source.use?.('uk');
    });

    it('should emit a value according to the current language', () => {
      expect(valueSpy.values).toStrictEqual(['Hello', 'Привіт']);
    });
  });
});
