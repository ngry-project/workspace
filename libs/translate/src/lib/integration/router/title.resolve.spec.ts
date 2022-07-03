import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LanguageModule } from '../../language.module';
import { TitleProvider } from './title.provider';
import { TitleResolve } from './title.resolve';

@Component({
  standalone: true,
})
class HomeComponent {}

@Component({
  standalone: true,
})
class BlogComponent {}

@Component({
  standalone: true,
})
class ArticleComponent {}

describe('TitleResolve', () => {
  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            title: TitleResolve,
            providers: [
              TitleProvider({
                phrase: {
                  en: 'Brand name',
                },
              }),
            ],
            children: [
              {
                path: '',
                component: HomeComponent,
                title: TitleResolve,
                providers: [
                  TitleProvider({
                    phrase: { en: 'Home' },
                  }),
                ],
              },
              {
                path: 'blog',
                loadChildren: async () => [
                  {
                    path: '',
                    component: BlogComponent,
                    title: TitleResolve,
                    providers: [
                      TitleProvider({
                        phrase: {
                          en: 'Blog',
                          uk: 'Блог',
                        },
                      }),
                    ],
                    children: [
                      {
                        path: ':article_id',
                        component: ArticleComponent,
                        title: TitleResolve,
                        providers: [
                          TitleProvider({
                            phrase: {
                              en: '{{ title }}',
                              uk: '{{ title }}',
                            },
                            params: () => {
                              return (route) => {
                                const id = route.params['article_id'];

                                return of({
                                  title: `Article #${id}`,
                                });
                              };
                            },
                          }),
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]),
      ],
      providers: [
        LanguageModule({
          default: 'en',
          supported: ['en', 'uk'],
        }),
      ],
    }).compileComponents();
  });

  let router: Router;
  let title: Title;

  beforeEach(() => {
    router = TestBed.inject(Router);
    title = TestBed.inject(Title);
  });

  beforeEach(() => {
    expect(title.getTitle()).toBe('');
  });

  it('should resolve a title from routes hierarchy', async () => {
    await router.navigate([]);

    expect(title.getTitle()).toBe('Home - Brand name');

    await router.navigate(['blog']);

    expect(title.getTitle()).toBe('Blog - Brand name');

    await router.navigate(['blog', '223']);

    expect(title.getTitle()).toBe('Article #223 - Blog - Brand name');
  });
});
