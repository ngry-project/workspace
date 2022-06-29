import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  PRIMARY_OUTLET,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { select } from '@ngry/store';
import { Observable } from 'rxjs';
import { compileStandalonePhrase } from './compile-standalone-phrase';
import { StandalonePhraseData } from './standalone-phrase-data';
import { useLanguageChanges } from './use-language-changes';

@Injectable({
  providedIn: 'root',
})
export class ResolveTitle implements Resolve<string> {
  private readonly language$ = useLanguageChanges();

  resolve(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<string> {
    const dataset = this.collectPhrases([], state.root);
    const standalonePhrases = dataset.map(compileStandalonePhrase);

    return this.language$.pipe(
      select((language) =>
        standalonePhrases
          .map((standalonePhrase) =>
            standalonePhrase(language).orJust(() => ''),
          )
          .map((phrase) => phrase())
          .filter((text) => text.length > 0)
          .join(' - '),
      ),
    );
  }

  private collectPhrases = (
    accumulator: readonly StandalonePhraseData[],
    route: ActivatedRouteSnapshot,
  ): readonly StandalonePhraseData[] => {
    if (route.outlet === PRIMARY_OUTLET) {
      const data: StandalonePhraseData | undefined = route.data['title'];

      if (data && data !== accumulator[accumulator.length - 1]) {
        accumulator = [data, ...accumulator];
      }

      return route.children.reduce(this.collectPhrases, accumulator);
    }

    return accumulator;
  };
}
