import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { skip, Subject, takeUntil, tap } from 'rxjs';
import { Params } from './params';
import { useTranslate } from './use-translate';
import { TranslateInput } from './translate-input';
import { useLanguage } from './use-language';

/**
 * Resolves a translated text by phrase key and optional params.
 */
@Pipe({
  name: 'translate',
  pure: false,
  standalone: true,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly translate = useTranslate();
  private readonly language = useLanguage();

  constructor(cdr: ChangeDetectorRef) {
    this.language
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        tap(() => cdr.markForCheck()),
      )
      .subscribe();
  }

  transform(input: TranslateInput, params?: Params): string {
    return this.translate(input, params);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
