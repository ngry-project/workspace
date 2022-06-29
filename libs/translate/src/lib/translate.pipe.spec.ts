import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { FakeLanguageSource } from './fake-language-source';
import { LanguageSource } from './language-source';
import { LANGUAGE_SOURCE } from './language-source.token';
import { StandalonePhraseData } from './standalone-phrase-data';
import { TranslatePipe } from './translate.pipe';
import { TranslateProvider } from './translate.provider';
import { TranslateModule } from './translate.module';

interface Data {
  readonly title: StandalonePhraseData;
}

@Injectable({ providedIn: 'root' })
class DataService {
  getData(): Observable<Array<Data>> {
    return of([
      {
        title: {
          uk: 'Привіт',
          en: 'Hello',
        },
      },
    ]);
  }
}

@Component({
  selector: 'ngry-test',
  template: `
    <h2>{{ 'heading' | translate }}</h2>
    <ul>
      <li *ngFor="let item of data$ | async">
        {{ item.title | translate }}
      </li>
    </ul>
  `,
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  viewProviders: [
    TranslateProvider({
      uk: {
        heading: 'Приклади',
      },
      en: {
        heading: 'Examples',
      },
    }),
  ],
})
class TestComponent {
  readonly data$ = this.service.getData();

  constructor(private readonly service: DataService) {}
}

describe('TranslatePipe', () => {
  let source: LanguageSource;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(() => ({
          language: {
            default: 'en',
            supported: ['en', 'uk'],
            source: new FakeLanguageSource('en'),
          },
        })),
        TestComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    source = TestBed.inject(LANGUAGE_SOURCE);
    fixture = TestBed.createComponent(TestComponent);
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  describe('transform', () => {
    it('should translate a component-scoped phrase', () => {
      const headingElement = fixture.debugElement.query(By.css('h2'));

      expect(headingElement.properties['innerHTML']).toContain('Examples');
    });

    it('should translate a standalone phrase', () => {
      const itemElements = fixture.debugElement.queryAll(By.css('li'));

      expect(itemElements.length).toBe(1);

      for (const itemElement of itemElements) {
        expect(itemElement.properties['innerHTML']).toContain('Hello');
      }
    });

    describe('when language has changed', () => {
      beforeEach(() => {
        source.use?.('uk');

        fixture.detectChanges();
      });

      it('should translate a component-scoped phrase', () => {
        const headingElement = fixture.debugElement.query(By.css('h2'));

        expect(headingElement.properties['innerHTML']).toContain('Приклади');
      });

      it('should translate a standalone phrase', () => {
        const itemElements = fixture.debugElement.queryAll(By.css('li'));

        expect(itemElements.length).toBe(1);

        for (const itemElement of itemElements) {
          expect(itemElement.properties['innerHTML']).toContain('Привіт');
        }
      });
    });
  });
});
