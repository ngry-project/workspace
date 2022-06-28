import { ObservableSpy } from '@ngry/rx';
import { select } from './select';
import { Store } from './store';

describe('select', () => {
  let store: Store<number>;
  let isEventSpy: ObservableSpy<boolean>;

  beforeEach(() => {
    store = new Store(0);
    isEventSpy = new ObservableSpy(
      store.pipe(select((state) => state % 2 === 0)),
    );
  });

  describe('optimization', () => {
    beforeEach(() => {
      store.next(1);
      store.next(2);
      store.next(3);
    });

    it('should optimize', () => {
      expect(isEventSpy.values).toEqual([true, false, true, false]);
    });
  });
});
