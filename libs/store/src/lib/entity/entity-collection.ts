import { CompareFunction } from '../type/compare-function';
import { PredicateFunction } from '../type/predicate-function';

/**
 * Represents an immutable collection of entities.
 */
export abstract class EntityCollection<
  ID,
  Entity,
  EntityCollection_ extends EntityCollection<ID, Entity, any>,
> implements Iterable<Entity>
{
  /**
   * Gets list of entities IDs.
   */
  readonly ids: ReadonlyArray<ID>;

  /**
   * Gets list of entities.
   */
  readonly entities: ReadonlyArray<Entity>;

  /**
   * Gets length of collection.
   */
  get length(): number {
    return this.ids.length;
  }

  /**
   * Indicates whether collection is empty or not.
   */
  get empty(): boolean {
    return this.ids.length === 0;
  }

  /**
   * Initializes new instance.
   * @param entities Iterable source of entities
   */
  constructor(entities: Iterable<Entity> = []) {
    const _entities = [...entities].reduce((accumulator, entity) => {
      const index = this.selectId(entity);
      const _index = accumulator.findIndex(
        (_entity) => this.selectId(_entity) === index,
      );

      if (_index >= 0) {
        accumulator.splice(_index, 1);
      }

      accumulator.push(entity);

      return accumulator;
    }, [] as Array<Entity>);

    this.ids = _entities.map((entity) => this.selectId(entity));
    this.entities = [..._entities];
  }

  [Symbol.iterator](): Iterator<Entity> {
    return this.entities[Symbol.iterator]();
  }

  /**
   * Gets an entity by ID.
   * If no entity with such ID found, returns {@link undefined}.
   * @param id Entity ID
   */
  get(id: ID): Entity | undefined {
    const idx = this.ids.indexOf(id);

    return this.entities[idx];
  }

  /**
   * Determines whether this collection has an entity with such ID.
   * @param id Entity ID
   */
  has(id: ID): boolean {
    for (const _id of this.ids) {
      if (this.compareIds(_id, id)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determines whether this collection has an entity with the same ID as given one.
   * @param entity Instance of entity
   */
  includes(entity: Entity): boolean {
    return this.has(this.selectId(entity));
  }

  /**
   * Returns new instance of collection with given entity when one didn't include an entity with the same ID.
   * Returns self when already includes an entity with the same ID.
   * @param entity Instance of entity
   */
  add(entity: Entity): EntityCollection_ {
    if (this.includes(entity)) {
      return this as unknown as EntityCollection_;
    }

    return this.create([...this.entities, entity]);
  }

  /**
   * Returns new instance of collection with given entities when one didn't include any entity with the same ID.
   * Returns self when already includes all entities with the same ID.
   * @param entities Iterable source of entities
   */
  addMany(entities: Iterable<Entity>): EntityCollection_ {
    let collection: EntityCollection_ = this as unknown as EntityCollection_;

    for (const entity of entities) {
      collection = collection.add(entity);
    }

    return collection;
  }

  /**
   * Returns new instance of collection with given entity instead of one with the same ID.
   * Returns self when collection doesn't include an entity with the same ID.
   * @param entity Instance of entity
   */
  update(entity: Entity): EntityCollection_ {
    const index = this.entities.findIndex((_entity) =>
      this.compareIds(this.selectId(entity), this.selectId(_entity)),
    );

    if (index >= 0) {
      const entities = [...this.entities];

      entities[index] = entity;

      return this.create(entities);
    }

    return this as unknown as EntityCollection_;
  }

  /**
   * Returns new instance of collection with given entities instead of ones with the same ID.
   * Returns self when collection doesn't include any entity with the same ID.
   * @param entities Iterable source of entities
   */
  updateMany(entities: Iterable<Entity>): EntityCollection_ {
    let collection = this as unknown as EntityCollection_;

    for (const entity of entities) {
      collection = collection.update(entity);
    }

    return collection;
  }

  /**
   * Returns new instance of collection with given entity.
   * When collection already includes an entity with the same ID, it will be replaced.
   * When collection doesn't include an entity with the same ID, it will be added.
   * @param entity Instance of entity
   */
  set(entity: Entity): EntityCollection_ {
    if (this.includes(entity)) {
      return this.update(entity);
    } else {
      return this.add(entity);
    }
  }

  /**
   * Returns new instance of collection with given entities.
   * When collection already includes an entity with the same ID, it will be replaced.
   * When collection doesn't include an entity with the same ID, it will be added.
   * @param entities Iterable source of entities
   */
  setMany(entities: Iterable<Entity>): EntityCollection_ {
    let collection: EntityCollection_ = this as unknown as EntityCollection_;

    for (const entity of entities) {
      collection = collection.set(entity);
    }

    return collection;
  }

  /**
   * Returns new collection without entity with given ID when collection includes one.
   * Returns self when doesn't include an entity with given ID.
   * @param id Entity ID
   */
  delete(id: ID): EntityCollection_ {
    if (this.has(id)) {
      return this.create(
        this.entities.filter((entity) => this.selectId(entity) !== id),
      );
    } else {
      return this as unknown as EntityCollection_;
    }
  }

  /**
   * Returns new collection without entities with given IDs when collection includes any.
   * Returns self when doesn't include any entities with given IDs.
   * @param ids Entities IDs
   */
  deleteMany(ids: Iterable<ID>): EntityCollection_ {
    const entities = this.entities.filter((entity) => {
      const entityId = this.selectId(entity);

      for (const id of ids) {
        if (this.compareIds(id, entityId)) {
          return false;
        }
      }

      return true;
    });

    if (this.entities.length === entities.length) {
      return this as unknown as EntityCollection_;
    } else {
      return this.create(entities);
    }
  }

  /**
   * Returns new collection without entity with the same ID when collection includes one.
   * Returns self when doesn't include an entity with the same ID.
   * @param sample Instance of entity
   */
  remove(sample: Entity): EntityCollection_ {
    const id: ID = this.selectId(sample);

    return this.delete(id);
  }

  /**
   * Returns new collection without entities with same IDs when collection includes any.
   * Returns self when doesn't include any entities with the same IDs.
   * @param samples Iterable source of entities
   */
  removeMany(samples: Iterable<Entity>): EntityCollection_ {
    const ids: Set<ID> = new Set<ID>();

    for (const entity of samples) {
      ids.add(this.selectId(entity));
    }

    return this.deleteMany(ids);
  }

  /**
   * Returns an empty collection when not empty itself.
   * Returns self when already empty.
   */
  clear(): EntityCollection_ {
    if (this.empty) {
      return this as unknown as EntityCollection_;
    }

    return this.create([]);
  }

  /**
   * Returns new collection with entities matching predicate when predicate didn't match all entities.
   * Returns self when predicate matches all entities.
   */
  filter(predicate: PredicateFunction<Entity>): EntityCollection_ {
    const length = this.entities.length;
    const entities = this.entities.filter((entity) => predicate(entity));

    if (entities.length === length) {
      return this as unknown as EntityCollection_;
    }

    return this.create(entities);
  }

  /**
   * Returns sorted collection when entities order has changed.
   * Returns self when entities order hasn't changed.
   * @param compare Entity comparison function
   */
  sort(compare: CompareFunction<Entity>): EntityCollection_ {
    const entities = [...this.entities].sort(compare);

    for (let i = 0; i < entities.length; i++) {
      const aId = this.selectId(entities[i]);
      const bId = this.selectId(this.entities[i]);

      if (!this.compareIds(aId, bId)) {
        return this.create(entities);
      }
    }

    return this as unknown as EntityCollection_;
  }

  /**
   * Returns an array representation of this collection.
   */
  toArray(): Array<Entity> {
    return [...this.entities];
  }

  /**
   * Create new instance of collection.
   * @param entities Iterable source of entities
   */
  protected abstract create(entities: Iterable<Entity>): EntityCollection_;

  /**
   * Returns an ID of given entity.
   * @param entity Instance of entity
   */
  protected abstract selectId(entity: Entity): ID;

  /**
   * Compares entities IDs for equality.
   * @param a ID of left entity
   * @param b ID of right entity
   */
  protected abstract compareIds(a: ID, b: ID): boolean;
}
