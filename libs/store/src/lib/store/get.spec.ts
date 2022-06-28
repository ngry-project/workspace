import { get } from './get';
import { Store } from './store';

interface TestState {
  readonly a: number;
  readonly b: number;
}

class TestStore extends Store<TestState> {
  constructor() {
    super({ a: 0, b: 0 });
  }

  readonly getA = get(this, 'a');
}

describe('get', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  it('should create a getter function', () => {
    expect(store.getA).toBeInstanceOf(Function);
  });

  it('should return a property value on call', () => {
    expect(store.getA()).toBe(0);
    expect(get(store, 'b')()).toBe(0);
  });
});
