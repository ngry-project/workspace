import { Observable } from 'rxjs';
import { select } from '../store/select';
import { Store } from '../store/store';
import { update } from '../store/update';
import { CompareFunction } from '../type/compare-function';
import { PredicateFunction } from '../type/predicate-function';
import { EntityCollection } from './entity-collection';

/**
 * Represents a store of {@link EntityCollection}.
 */
export class EntityCollectionStore<
  ID,
  Entity,
  EntityCollection_ extends EntityCollection<ID, Entity, any>,
> extends Store<EntityCollection_> {
  /**
   * Gets stream of entities IDs.
   */
  readonly ids$: Observable<ReadonlyArray<ID>>;

  /**
   * Gets stream of entities.
   */
  readonly entities$: Observable<ReadonlyArray<Entity>>;

  /**
   * Gets stream of entities count.
   */
  readonly length$: Observable<number>;

  /**
   * Gets stream of empty state changes.
   */
  readonly empty$: Observable<boolean>;

  constructor(initial: EntityCollection_) {
    super(initial);

    this.ids$ = this.pipe(select((collection) => collection.ids));
    this.entities$ = this.pipe(select((collection) => collection.entities));
    this.length$ = this.pipe(select((collection) => collection.length));
    this.empty$ = this.pipe(select((collection) => collection.empty));
  }

  /**
   * Emits new instance of collection with given entity when one didn't include an entity with the same ID.
   * @param entity Instance of entity
   */
  readonly add = update(this, (collection: EntityCollection_, entity: Entity) =>
    collection.add(entity),
  );

  /**
   * Emits new instance of collection with given entities when one didn't include any entity with the same ID.
   * @param entities Iterable source of entities
   */
  readonly addMany = update(
    this,
    (collection: EntityCollection_, entities: Iterable<Entity>) =>
      collection.addMany(entities),
  );

  /**
   * Emits new instance of collection with given entity instead of one with the same ID.
   * @param entity Instance of entity
   */
  readonly update = update(
    this,
    (collection: EntityCollection_, entity: Entity) =>
      collection.update(entity),
  );

  /**
   * Emits new instance of collection with given entities instead of ones with the same ID.
   * @param entities Iterable source of entities
   */
  readonly updateMany = update(
    this,
    (collection: EntityCollection_, entities: Iterable<Entity>) =>
      collection.updateMany(entities),
  );

  /**
   * Emits new instance of collection with given entity.
   * When collection already includes an entity with the same ID, it will be replaced.
   * When collection doesn't include an entity with the same ID, it will be added.
   * @param entity Instance of entity
   */
  readonly set = update(this, (collection: EntityCollection_, entity: Entity) =>
    collection.set(entity),
  );

  /**
   * Emits new instance of collection with given entities.
   * When collection already includes an entity with the same ID, it will be replaced.
   * When collection doesn't include an entity with the same ID, it will be added.
   * @param entities Iterable source of entities
   */
  readonly setMany = update(
    this,
    (collection: EntityCollection_, entities: Iterable<Entity>) =>
      collection.setMany(entities),
  );

  /**
   * Emits new collection without entity with given ID when collection includes one.
   * @param id Entity ID
   */
  readonly delete = update(this, (collection: EntityCollection_, id: ID) =>
    collection.delete(id),
  );

  /**
   * Emits new collection without entities with given IDs when collection includes any.
   * @param ids Entities IDs
   */
  readonly deleteMany = update(
    this,
    (collection: EntityCollection_, ids: Iterable<ID>) =>
      collection.deleteMany(ids),
  );

  /**
   * Emits new collection without entity with the same ID when collection includes one.
   * @param sample Instance of entity
   */
  readonly remove = update(
    this,
    (collection: EntityCollection_, sample: Entity) =>
      collection.remove(sample),
  );

  /**
   * Emits new collection without entities with same IDs when collection includes any.
   * @param entities Iterable source of entities
   */
  readonly removeMany = update(
    this,
    (collection: EntityCollection_, entities: Iterable<Entity>) =>
      collection.removeMany(entities),
  );

  /**
   * Emits an empty collection when not empty itself.
   */
  readonly clear = update(this, (collection: EntityCollection_) =>
    collection.clear(),
  );

  /**
   * Emits new collection with entities matching predicate when predicate didn't match all entities.
   */
  readonly filter = update(
    this,
    (collection: EntityCollection_, predicate: PredicateFunction<Entity>) =>
      collection.filter(predicate),
  );

  /**
   * Emits sorted collection when entities order has changed.
   * @param compare Entity comparison function
   */
  readonly sort = update(
    this,
    (collection: EntityCollection_, compare: CompareFunction<Entity>) =>
      collection.sort(compare),
  );
}
