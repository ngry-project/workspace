import { ObservableSpy, task, TaskState } from '@ngry/rx';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { fn } from './fn';
import { property } from './property';
import { Store } from './store';
import { update } from './update';

interface TestState {
  readonly loading: TaskState;
  readonly removing: TaskState;
}

class TestStore extends Store<TestState> {
  constructor() {
    super({
      loading: TaskState.initial(),
      removing: TaskState.initial(),
    });
  }

  readonly load = fn<[id: string]>((args$) =>
    args$.pipe(
      switchMap(([id]) => task(() => of({ id }))),
      tap(update(this, property('loading'))),
    ),
  );
}

describe('fn', () => {
  let store: TestStore;
  let stateSpy: ObservableSpy<TestState>;

  beforeEach(() => {
    store = new TestStore();
    stateSpy = new ObservableSpy(store);
  });

  it('should create a function', () => {
    expect(store.load).toBeInstanceOf(Function);
  });

  it('should trigger an RxJS pipeline on call', () => {
    store.load('some-id');

    expect(stateSpy.values).toStrictEqual([
      {
        loading: TaskState.initial(),
        removing: TaskState.initial(),
      },
      {
        loading: TaskState.pending(),
        removing: TaskState.initial(),
      },
      {
        loading: TaskState.complete({ id: 'some-id' }),
        removing: TaskState.initial(),
      },
    ]);
  });
});
