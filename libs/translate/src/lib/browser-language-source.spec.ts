import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { BrowserLanguageSource } from './browser-language-source';
import { Language } from './language';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageModule } from './language.module';

describe('BrowserLanguageSource', () => {
  let source: LanguageSource;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageModule({
          default: 'en',
          source: BrowserLanguageSource(),
        }),
      ],
    });

    source = TestBed.inject(LANGUAGE_SOURCE);
  });

  describe('current', () => {
    it('should return the current language', () => {
      expect(source.current).toBe('en-US');
    });
  });

  describe('changes', () => {
    let languageSpy: ObservableSpy<Language>;

    beforeEach(() => {
      languageSpy = new ObservableSpy(source.changes);
    });

    describe('initial state', () => {
      it('should emit on language change', () => {
        expect(languageSpy.values).toStrictEqual(['en-US']);
      });
    });

    describe('when browser language changed', () => {
      beforeEach(() => {
        jest
          .spyOn(window.navigator, 'language', 'get')
          .mockImplementation(() => 'uk-UA');

        window.dispatchEvent(new Event('languagechange'));
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should emit on language change', () => {
        expect(languageSpy.values).toStrictEqual(['en-US', 'uk-UA']);
      });
    });
  });
});
