# :globe_with_meridians: Efficient translation module for Angular

### Table of contents

- [:package: Installation](#package-installation)
- [:gem: Key benefits](#gem-key-benefits)
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

:arrow_up: [Table of contents](#table-of-contents)

## :gem: Key benefits

**Flexible language configuration:** define a [default language](#default-language), a list of [supported languages](#supported-languages); provide a custom [language source](#language-source); control the language resolution using [guards](#language-guards); control the language transition process using a [language change handler](#language-change-handler).

**Component-scoped translations:** just like styles, translation isolation makes components more standalone and reusable and eliminates long translation keys.

**Performance:** Angular compiler applies all the same optimizations to translations as it does to the normal code - tree shaking, code splitting and lazy loading.

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
📁 user-menu
   📄 user-menu.component.html
   📄 user-menu.component.json // component's translations
   📄 user-menu.component.scss
   📄 user-menu.component.ts
   📄 user-menu.component.spec.ts
```

Add translations for each supported language for this component:

`user-menu.component.json`

```json
{
  "en": {
    "account": "Account",
    "settings": "Settings",
    "sign-out": "Sing out",
    "sign-out-confirmation": "Do you want to sign out?"
  },
  "uk": {
    "account": "Обліковий запис",
    "settings": "Налаштування",
    "sign-out": "Вихід",
    "sign-out-confirmation": "Ви справді хочете вийти?"
  }
}
```

Import translations just like any other file and provide them to component's `viewProviders` using `TranslateProvider` factory:

`user-menu.component.ts`

```ts
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

> :information_source: **Hint**
>
> In order to import `.json` files, make sure you have these options enabled in `tsconfig.json`:
>
> ```json
> "resolveJsonModule": true,
> "allowSyntheticDefaultImports": true,
> ```

Access phrase by key in component's template using `translate` pipe (declarative approach):

`user-menu.component.html`

```html
<app-menu>
  <app-menu-item>{{'account' | translate}}</app-menu-item>
  <app-menu-item>{{'settings' | translate}}</app-menu-item>
  <app-menu-item>{{'sign-out' | translate}}</app-menu-item>
</app-menu>
```

Access phrase by key in component's code using `useTranslate` hook (imperative approach):

`user-menu.component.ts`

```ts
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

:arrow_up: [Table of contents](#table-of-contents)

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

> :information_source: **Hint**
>
> It's recommented to use [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format for language codes.
>
> Examples: "en", "uk", "pl", "zh", "it", "de" etc.

:arrow_up: [Table of contents](#table-of-contents) | [Language configuration](#wrench-language-configuration)

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

:arrow_up: [Table of contents](#table-of-contents) | [Language configuration](#wrench-language-configuration)

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

:arrow_up: [Table of contents](#table-of-contents) | [Language configuration](#wrench-language-configuration)

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

:arrow_up: [Table of contents](#table-of-contents) | [Language configuration](#wrench-language-configuration)

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

:arrow_up: [Table of contents](#table-of-contents) | [Language configuration](#wrench-language-configuration)

## License

MIT
