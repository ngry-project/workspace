import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { LanguageModule } from '../../language.module';
import { TitleProvider } from './title.provider';
import { TitleResolve } from './title.resolve';

describe('TitleProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageModule({
          default: 'en',
        }),
        TitleProvider({
          phrase: {
            en: 'Home page',
          },
        }),
      ],
    });
  });

  describe('TitleResolve', () => {
    let resolve: TitleResolve;
    let titleSpy: ObservableSpy<string>;

    beforeEach(() => {
      resolve = TestBed.inject(TitleResolve);
    });

    describe('resolve', () => {
      beforeEach(() => {
        titleSpy = new ObservableSpy(resolve.resolve({} as any, {} as any));
      });

      it('should resolve to route title', () => {
        expect(titleSpy.values).toStrictEqual(['Home page']);
      });
    });
  });
});
