import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ObservableSpy, ofType, task, TaskState } from '@ngry/rx';
import { of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Actions } from '../action/actions';
import { isDefined } from '../util/is-defined';
import { property } from './property';
import { select } from './select';
import { Store } from './store';
import { update } from './update';
import { useEffect } from './use-effect';

interface TestEntity {
  readonly id: number;
  readonly content: string;
}

interface TestState {
  readonly id?: number;
  readonly data: TaskState<TestEntity>;
}

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent extends Store<TestState> {
  constructor(route: ActivatedRoute) {
    super({
      data: TaskState.initial(),
    });

    useEffect(this, () =>
      route.queryParamMap.pipe(
        map((params) => params.get('id')),
        filter(isDefined),
        map((id) => parseInt(id)),
        tap(update(this, property('id'))),
      ),
    );

    useEffect(this, (state$) =>
      state$.pipe(
        select(({ id }) => id),
        filter(isDefined),
        switchMap((id) =>
          task(() => of({ id, content: 'content' })).pipe(
            tap(update(this, property('data'))),
          ),
        ),
      ),
    );
  }
}

class Load {
  constructor(readonly id: number) {}
}

@Injectable({ providedIn: 'root' })
class TestStore extends Store<TestState> {
  constructor(actions: Actions) {
    super({
      data: TaskState.initial(),
    });

    useEffect(this, () =>
      actions.pipe(
        ofType(Load),
        map(({ id }) => id),
        tap(update(this, property('id'))),
      ),
    );

    useEffect(this, (state$) =>
      state$.pipe(
        select(({ id }) => id),
        filter(isDefined),
        switchMap((id) =>
          task(() => of({ id, content: 'content' })).pipe(
            tap(update(this, property('data'))),
          ),
        ),
      ),
    );
  }
}

describe('useEffect', () => {
  describe('within component', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let stateSpy: ObservableSpy<TestState>;

    let router: Router;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        declarations: [TestComponent],
      }).compileComponents();

      router = TestBed.inject(Router);

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;

      stateSpy = new ObservableSpy(component);
    });

    beforeEach(async () => {
      await router.navigate([], {
        queryParams: {
          id: 1,
        },
      });

      fixture.detectChanges();

      await fixture.whenStable();
    });

    it('should trigger a pipeline on state change', () => {
      expect(stateSpy.values.length).toBe(4);

      expect(stateSpy.values).toStrictEqual([
        {
          data: TaskState.initial(),
        },
        {
          id: 1,
          data: TaskState.initial(),
        },
        {
          id: 1,
          data: TaskState.pending(),
        },
        {
          id: 1,
          data: TaskState.complete({ id: 1, content: 'content' }),
        },
      ]);
    });
  });

  describe('within service', () => {
    let actions: Actions;
    let store: TestStore;
    let stateSpy: ObservableSpy<TestState>;

    beforeEach(() => {
      actions = TestBed.inject(Actions);
      store = TestBed.inject(TestStore);
      stateSpy = new ObservableSpy(store);
    });

    beforeEach(() => {
      actions.next(new Load(1));
    });

    it('should trigger a pipeline on state change', () => {
      expect(stateSpy.values.length).toBe(4);

      expect(stateSpy.values).toStrictEqual([
        {
          data: TaskState.initial(),
        },
        {
          id: 1,
          data: TaskState.initial(),
        },
        {
          id: 1,
          data: TaskState.pending(),
        },
        {
          id: 1,
          data: TaskState.complete({ id: 1, content: 'content' }),
        },
      ]);
    });
  });
});
