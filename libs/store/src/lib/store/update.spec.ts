import { ObservableSpy } from '@ngry/rx';
import { patch } from './patch';
import { property } from './property';
import { reset } from './reset';
import { Store } from './store';
import { to } from './to';
import { update } from './update';

interface Address {
  readonly country: string | null;
  readonly region: string | null;
  readonly city: string | null;
  readonly street: string | null;
  readonly number: string | null;
}

interface Person {
  readonly id?: number;
  readonly name: string | null;
  readonly likes: number | null;
  readonly address: Address;
  readonly tags: readonly string[];
}

function increment(step = 1) {
  return (value: number | null = 0) => (value ?? 0) + step;
}

function append<T>() {
  return (items: readonly T[], item: T) => [...items, item];
}

class PersonStore extends Store<Person> {
  constructor() {
    super({
      name: null,
      likes: null,
      address: {
        country: null,
        region: null,
        city: null,
        street: null,
        number: null,
      },
      tags: [],
    });
  }

  readonly rename = update(
    this,
    patch((_: Person, name: string) => ({ name })),
  );

  readonly setLikes = update(this, property('likes'));
  readonly like = update(this, property('likes', increment()));

  readonly setAddress = update(this, property('address'));
  readonly updateAddress = update(this, property('address', patch()));
  readonly resetAddress = update(
    this,
    property(
      'address',
      to<Address>({
        country: null,
        region: null,
        city: null,
        street: null,
        number: null,
      }),
    ),
  );
  readonly setCity = update(this, property('address', property('city')));

  readonly addTag = update(this, property('tags', append()));
  readonly clearTags = update(this, property('tags', to([])));

  readonly set = update(this);
  readonly reset = reset(this);
}

describe('update', () => {
  let store: PersonStore;
  let stateSpy: ObservableSpy<Person>;

  beforeEach(() => {
    store = new PersonStore();
    stateSpy = new ObservableSpy(store);
  });

  beforeEach(() => {
    store.set({
      name: 'Bob',
      likes: null,
      address: {
        country: null,
        region: null,
        city: null,
        street: null,
        number: null,
      },
      tags: [],
    });
    store.rename('Alex');
    store.setLikes(25);
    store.like();
    store.setAddress({
      country: 'Ukraine',
      region: 'Donetsk',
      city: 'Slovyansk',
      street: 'Vyshneva',
      number: '1a',
    });
    store.updateAddress({
      city: "Slovyans'k",
    });
    store.setCity('Kyiv');
    store.resetAddress();
    store.addTag('test');
    store.clearTags();
    store.reset();
  });

  it('should update state on call using args', () => {
    expect(stateSpy.values).toStrictEqual([
      {
        name: null,
        likes: null,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Bob',
        likes: null,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: null,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 25,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: 'Ukraine',
          region: 'Donetsk',
          city: 'Slovyansk',
          street: 'Vyshneva',
          number: '1a',
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: 'Ukraine',
          region: 'Donetsk',
          city: "Slovyans'k",
          street: 'Vyshneva',
          number: '1a',
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: 'Ukraine',
          region: 'Donetsk',
          city: 'Kyiv',
          street: 'Vyshneva',
          number: '1a',
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: ['test'],
      },
      {
        name: 'Alex',
        likes: 26,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
      {
        name: null,
        likes: null,
        address: {
          country: null,
          region: null,
          city: null,
          street: null,
          number: null,
        },
        tags: [],
      },
    ]);
  });
});
