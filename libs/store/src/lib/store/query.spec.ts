import { ObservableSpy } from '@ngry/rx';
import { query } from './query';
import { Store } from './store';

class TagsStore extends Store<readonly string[]> {
  constructor() {
    super([]);
  }

  readonly findCompositeTags = query(this, (tags, separator: string) =>
    tags.filter((tag) => tag.includes(separator)),
  );
}

describe('query', () => {
  let store: TagsStore;
  let resultSpy: ObservableSpy<string[]>;

  beforeEach(() => {
    store = new TagsStore();
    resultSpy = new ObservableSpy(store.findCompositeTags(':'));
  });

  beforeEach(() => {
    store.next(['apps:website', 'uikit', 'docs']);
    store.next(['apps:website', 'lib:auth', 'uikit', 'docs']);
    store.next(['apps:website', 'lib:auth', 'uikit', 'docs', 'e2e']);
  });

  it('should emit distinct query results', () => {
    expect(resultSpy.values).toStrictEqual([
      [],
      ['apps:website'],
      ['apps:website', 'lib:auth'],
    ]);
  });
});
