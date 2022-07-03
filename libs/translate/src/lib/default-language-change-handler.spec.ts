import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { DefaultLanguageSource } from './default-language-source';
import { Language } from './language';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { LanguageStore } from './language-store';
import { LanguageModule } from './language.module';

describe('DefaultLanguageChangeHandler', () => {
  let source: LanguageSource;
  let store: LanguageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageModule({
          default: 'en',
          supported: ['en', 'uk'],
          source: DefaultLanguageSource(),
        }),
      ],
    });

    source = TestBed.inject(LANGUAGE_SOURCE);
    store = TestBed.inject(LanguageStore);
  });

  let languageSpy: ObservableSpy<Language>;

  beforeEach(() => {
    languageSpy = new ObservableSpy(store);
  });

  it('should handle a language change request', () => {
    expect(languageSpy.values).toEqual(['en']);

    source.use?.('uk');

    expect(languageSpy.values).toEqual(['en', 'uk']);

    source.use?.('ru');

    expect(languageSpy.values).toEqual(['en', 'uk', 'en']);
  });
});
