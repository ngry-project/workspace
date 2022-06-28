import { ObservableSpy } from '@ngry/rx';
import { Store } from './store';

describe('Store', () => {
  let store: Store<number>;
  let stateSpy: ObservableSpy<number>;

  beforeEach(() => {
    store = new Store(0);
    stateSpy = new ObservableSpy(store);
  });

  describe('next', () => {
    it('should update state', () => {
      store.next(1);
      store.next(2);
      store.next(3);
      store.next(3);

      expect(store.snapshot).toBe(3);
      expect(stateSpy.values).toEqual([0, 1, 2, 3]);
    });
  });
});
