# :globe_with_meridians: Efficient translation module for Angular

### Table of contents

- [:package: Installation](#package-installation)
- [:rocket: Quick start](#rocket-quick-start)
- [:wrench: Language configuration](#wrench-language-configuration)
  - [Default language](#default-language)
  - [Supported languages](#supported-languages)
  - [Language guards](#language-guards)
  - [Language source](#language-source)
  - [Language change handler](#language-change-handler)
- [License](#license)

## :package: Installation

Using NPM:

```bash
npm i @ngry/translate
```

Using Yarn:

```bash
yarn add @ngry/translate
```

## :rocket: Quick start

Provide a language configuration using `LanguageModule`.

If you're using standalone components, declare `LanguageModule` in `bootstrapApplication`'s `providers`:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule } from '@ngry/translate';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
    }),
  ],
});
```

If you still using `NgModule`s, declare `LanguageModule` in `providers` (yes, providers) of your app module:

```ts
import { NgModule } from '@angular/core';
import { LanguageModule } from '@ngry/translate';

@NgModule({
  providers: [
    LanguageModule({
      default: 'en',
    }),
  ],
})
export class AppModule {}
```

Add component's translations in a separate `.json` or `.ts` file next to the rest of its files:

```
user-menu/
  user-menu.component.html
  user-menu.component.json      <-- component's translations
  user-menu.component.scss
  user-menu.component.ts
  user-menu.component.spec.ts
```

Add translations for each supported language for this component:

```json
// user-menu.component.json
{
  "en": {
    "account": "Account",
    "settings": "Settings",
    "sign-out": "Sing out",
    "sign-out-confirmation": "Do you want sign out?"
  },
  "uk": {
    "account": "Обліковий запис",
    "settings": "Налаштування",
    "sign-out": "Вихід",
    "sign-out-confirmation": "Ви справді хочете вийти?"
  },
  ...
}
```

> :tada: Notice how clean and short phrase keys are!
>
> As translations are isolated at component level, there's no need for a very specific, app-wide unique, lengthy keys. Hooray!

Import translations just like any other file and provide them to component's `viewProviders` using `TranslateProvider` factory:

```ts
// user-menu.component.ts
import { TranslatePipe, TranslateProvider } from '@ngry/translate';
import TEXT_DATA from './user-menu.component.json';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [TranslatePipe],
  viewProviders: [TranslateProvider(TEXT_DATA)],
})
export class UserMenuComponent {}
```

> :information_source: Hint
>
> In order to import `.json` files, make sure you have these options enabled in `tsconfig.json`:
>
> ```json
> "resolveJsonModule": true,
> "allowSyntheticDefaultImports": true,
> ```

Access phrase by key in component's template using `translate` pipe (declarative approach):

```html
<!-- user-menu.component.html -->
<app-menu>
  <app-menu-item>{{'account' | translate}}</app-menu-item>
  <app-menu-item>{{'settings' | translate}}</app-menu-item>
  <app-menu-item>{{'sign-out' | translate}}</app-menu-item>
</app-menu>
```

Access phrase by key in component's code using `useTranslate` hook (imperative approach):

```ts
// user-menu.component.ts
import {
  TranslatePipe,
  TranslateProvider,
  useTranslate,
} from '@ngry/translate';
import TEXT_DATA from './user-menu.component.json';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [TranslatePipe],
  viewProviders: [TranslateProvider(TEXT_DATA)],
})
export class UserMenuComponent {
  private translate = useTranslate();

  signOut() {
    this.dialog
      .confirm(this.translate('sign-out-confirmation'))
      .pipe(
        filter(Boolean),
        tap(() => this.session.signOut()),
      )
      .subscribe();
  }
}
```

## :wrench: Language configuration

The module provides a flexible language configuration allowing to override behavior.

### Default language

Used as a fallback when the `LanguageSource` provides a non-supported one.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule } from '@ngry/translate';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
    }),
  ],
});
```

> :information_source: Recommendation
>
> Consider using [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format for language codes.
>
> Examples: "en", "uk", "pl", "zh", "it", "de" etc.

### Supported languages

Used to guarantee only supported language can be used.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule } from '@ngry/translate';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
      supported: ['en', 'fr', 'de', 'uk'],
    }),
  ],
});
```

### Language guards

Language guards resolve a `LanguageSource`'s language into a supported format and value.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule, LanguageMappingGuard } from '@ngry/translate';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
      supported: ['en', 'fr', 'de', 'uk'],
      guards: [
        LanguageMappingGuard({
          en: [/^en/i],
          fr: [/^fr/i],
          de: [/^de/i],
          ua: [/^ua/i, /^ru/i, /^be/i],
        }),
      ],
    }),
  ],
});
```

### Language source

A language source is an entity which

- encapsulates the source of the current language,
- pushes updates when the current language has been changed within the source.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule, BrowserLanguageSource } from '@ngry/translate';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
      supported: ['uk', 'en', 'fr', 'de'],
      source: BrowserLanguageSource(),
    }),
  ],
});
```

### Language change handler

A language change handler is an entity that gives you control over the decision when and how to apply the new language.

On one side, the language source only notifies about language change. On the other side, the language change handler
makes a final decision about 2 things:

- whether to apply the new language;
- what the new language will be applied in the end.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageModule, BrowserLanguageSource } from '@ngry/translate';
import { ConfirmLanguageChangeHandler } from './app/configuration/language/confirm-language-change-handler';

bootstrapApplication(AppComponent, {
  providers: [
    LanguageModule({
      default: 'en',
      supported: ['uk', 'en', 'fr', 'de'],
      source: BrowserLanguageSource(),
      change: ConfirmLanguageChangeHandler(),
    }),
  ],
});
```

## License

MIT
