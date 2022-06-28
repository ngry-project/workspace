import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ObservableSpy } from '@ngry/rx';
import { EntityCollection } from './entity-collection';
import { EntityCollectionStore } from './entity-collection-store';

class House {
  constructor(readonly id: number, readonly title: string) {}
}

class HouseCollection extends EntityCollection<number, House, HouseCollection> {
  protected selectId(house: House): number {
    return house.id;
  }

  protected create(entities: Iterable<House>): HouseCollection {
    return new HouseCollection(entities);
  }

  protected compareIds(a: number, b: number): boolean {
    return a === b;
  }
}

@Injectable()
class HouseCollectionStore extends EntityCollectionStore<
  number,
  House,
  HouseCollection
> {
  constructor() {
    super(new HouseCollection());
  }
}

describe('EntityCollectionStore', () => {
  let store: HouseCollectionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HouseCollectionStore],
    });

    store = TestBed.inject(HouseCollectionStore);
  });

  describe('ids$', () => {
    let idsSpy: ObservableSpy<ReadonlyArray<number>>;

    beforeEach(() => {
      idsSpy = new ObservableSpy(store.ids$);
    });

    it('should emit arrays of ids', () => {
      store.add(new House(1, 'Malibu apt'));
      store.add(new House(2, 'Malibu apt'));

      expect(idsSpy.values).toEqual([[], [1], [1, 2]]);
    });
  });

  describe('entities$', () => {
    let entitiesSpy: ObservableSpy<ReadonlyArray<House>>;

    beforeEach(() => {
      entitiesSpy = new ObservableSpy(store.entities$);
    });

    it('should emit arrays of entities', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');

      store.add(house1);
      store.add(house2);

      expect(entitiesSpy.values).toEqual([[], [house1], [house1, house2]]);
    });
  });

  describe('length$', () => {
    let lengthSpy: ObservableSpy<number>;

    beforeEach(() => {
      lengthSpy = new ObservableSpy(store.length$);
    });

    it('should emit length changes', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');

      store.add(house1);
      store.add(house2);

      expect(lengthSpy.values).toEqual([0, 1, 2]);
    });
  });

  describe('empty$', () => {
    let emptySpy: ObservableSpy<boolean>;

    beforeEach(() => {
      emptySpy = new ObservableSpy(store.empty$);
    });

    it('should emit empty status changes', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');

      store.add(house1);
      store.add(house2);

      expect(emptySpy.values).toEqual([true, false]);
    });
  });

  describe('add', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with added entity', () => {
      store.add(new House(1, 'Malibu apt'));
      store.add(new House(1, 'Malibu apt'));

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([new House(1, 'Malibu apt')]),
      ]);
    });
  });

  describe('addMany', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with added entities', () => {
      store.addMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);
      store.addMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
      ]);
    });
  });

  describe('set', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with replaced entity', () => {
      store.set(new House(1, 'Malibu apt'));
      store.set(new House(2, 'Malibu apt'));

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([new House(1, 'Malibu apt')]),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
      ]);
    });
  });

  describe('setMany', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with replaced entities', () => {
      store.setMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);
      store.setMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
      ]);
    });
  });

  describe('delete', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection without deleted entity', () => {
      store.add(new House(1, 'Malibu apt'));

      store.delete(1);
      store.delete(1);

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([new House(1, 'Malibu apt')]),
        new HouseCollection(),
      ]);
    });
  });

  describe('deleteMany', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection without deleted entities', () => {
      store.addMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);

      store.deleteMany([1, 2]);
      store.deleteMany([1, 2]);

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
        new HouseCollection(),
      ]);
    });
  });

  describe('remove', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection without deleted entity', () => {
      store.add(new House(1, 'Malibu apt'));

      store.remove(new House(1, 'Malibu apt'));
      store.remove(new House(1, 'Malibu apt'));

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([new House(1, 'Malibu apt')]),
        new HouseCollection(),
      ]);
    });
  });

  describe('removeMany', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection without deleted entities', () => {
      store.addMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);

      store.removeMany([
        new House(1, 'Malibu apt'),
        new House(2, 'Malibu apt'),
      ]);
      store.removeMany([
        new House(1, 'Malibu apt'),
        new House(2, 'Malibu apt'),
      ]);

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
        new HouseCollection(),
      ]);
    });
  });

  describe('clear', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with no entities', () => {
      store.addMany([new House(1, 'Malibu apt'), new House(2, 'Malibu apt')]);

      store.clear();
      store.clear();

      expect(stateSpy.values).toEqual([
        new HouseCollection(),
        new HouseCollection([
          new House(1, 'Malibu apt'),
          new House(2, 'Malibu apt'),
        ]),
        new HouseCollection(),
      ]);
    });
  });

  describe('update', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with replaced entity', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');
      const update2 = new House(2, 'Malibu apartment');
      const update3 = new House(3, 'Malibu apartment');

      store.addMany([house1, house2]);

      store.update(update2);
      store.update(update2);
      store.update(update3);

      expect(stateSpy.values.length).toBe(3);

      expect(stateSpy.values[0].length).toBe(0);

      expect(stateSpy.values[1].length).toBe(2);
      expect(stateSpy.values[1].get(1)).toBe(house1);
      expect(stateSpy.values[1].get(2)).toBe(house2);

      expect(stateSpy.values[2].length).toBe(2);
      expect(stateSpy.values[2].get(1)).toBe(house1);
      expect(stateSpy.values[2].get(2)).toBe(update2);
    });
  });

  describe('updateMany', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with replaced entity', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');
      const update2 = new House(2, 'Malibu apartment');
      const update3 = new House(3, 'Malibu apartment');

      store.addMany([house1, house2]);

      store.updateMany([update2, update3]);

      expect(stateSpy.values.length).toBe(3);

      expect(stateSpy.values[0].length).toBe(0);

      expect(stateSpy.values[1].length).toBe(2);
      expect(stateSpy.values[1].get(1)).toBe(house1);
      expect(stateSpy.values[1].get(2)).toBe(house2);
      expect(stateSpy.values[1].get(3)).toBe(undefined);

      expect(stateSpy.values[2].length).toBe(2);
      expect(stateSpy.values[2].get(1)).toBe(house1);
      expect(stateSpy.values[2].get(2)).toBe(update2);
      expect(stateSpy.values[2].get(3)).toBe(undefined);
    });
  });

  describe('filter', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with entities matching predicate', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');

      store.addMany([house1, house2]);

      store.filter((house) => house != null);
      store.filter((house) => house.id > 1);
      store.filter((house) => house.id > 1);

      expect(stateSpy.values.length).toBe(3);

      expect(stateSpy.values[0].length).toBe(0);

      expect(stateSpy.values[1].length).toBe(2);
      expect(stateSpy.values[1].get(1)).toBe(house1);
      expect(stateSpy.values[1].get(2)).toBe(house2);

      expect(stateSpy.values[2].length).toBe(1);
      expect(stateSpy.values[2].get(1)).toBe(undefined);
      expect(stateSpy.values[2].get(2)).toBe(house2);
    });
  });

  describe('sort', () => {
    let stateSpy: ObservableSpy<HouseCollection>;

    beforeEach(() => {
      stateSpy = new ObservableSpy(store);
    });

    it('should emit new collection with sorted entities', () => {
      const house1 = new House(1, 'Malibu apt');
      const house2 = new House(2, 'Malibu apt');
      const house3 = new House(3, 'Malibu apt');

      store.addMany([house1, house3, house2]);

      store.sort((a, b) => a.id - b.id);
      store.sort((a, b) => b.id - a.id);

      expect(stateSpy.values.length).toBe(4);

      expect(stateSpy.values[0].length).toBe(0);

      expect(stateSpy.values[1].length).toBe(3);
      expect(stateSpy.values[1].ids).toEqual([1, 3, 2]);
      expect(stateSpy.values[1].entities).toEqual([house1, house3, house2]);

      expect(stateSpy.values[2].length).toBe(3);
      expect(stateSpy.values[2].ids).toEqual([1, 2, 3]);
      expect(stateSpy.values[2].entities).toEqual([house1, house2, house3]);

      expect(stateSpy.values[3].length).toBe(3);
      expect(stateSpy.values[3].ids).toEqual([3, 2, 1]);
      expect(stateSpy.values[3].entities).toEqual([house3, house2, house1]);
    });
  });
});
