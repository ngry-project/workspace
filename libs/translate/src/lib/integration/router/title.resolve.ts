import { Inject, Injectable, Optional, Self, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { StandalonePhrase } from '../../standalone-phrase';
import { useLanguage } from '../../use-language';
import { ParamsResolve } from './params-resolve';
import { ROUTE_TITLE_PARAMS } from './route-title-params.token';
import { ROUTE_TITLE_PHRASE } from './route-title-phrase.token';

@Injectable()
export class TitleResolve  {
  private readonly language = useLanguage();

  get path(): readonly TitleResolve[] {
    const path: TitleResolve[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let ref: TitleResolve | null = this;

    while (ref) {
      path.push(ref);

      ref = ref.parent;
    }

    return path;
  }

  constructor(
    @Inject(TitleResolve)
    @SkipSelf()
    @Optional()
    readonly parent: TitleResolve | null,
    @Inject(ROUTE_TITLE_PHRASE) @Self() readonly phrase: StandalonePhrase,
    @Inject(ROUTE_TITLE_PARAMS) @Self() readonly getParams: ParamsResolve,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const language = this.language.snapshot;

    return this.getParams(route, state).pipe(
      map((params) =>
        this.path
          .map((item) =>
            item
              .phrase(language)
              .map((phrase) => phrase(params))
              .getOrElse(''),
          )
          .filter((text) => text.length > 0)
          .join(' - '),
      ),
    );
  }
}
