import { getKeys } from './get-keys';

/**
 * @internal
 */
export function isEqual<T = unknown>(a: T, b: T): boolean {
  const aType = typeof a;
  const bType = typeof b;

  if (aType !== bType) {
    return false;
  }

  if (aType === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      return isEqualArrays(a, b);
    }

    if (isMap(a) && isMap(b)) {
      return isEqualMaps(a, b);
    }

    if (isSet(a) && isSet(b)) {
      return isEqualSets(a, b);
    }

    if (isDate(a) && isDate(b)) {
      return isEqualDates(a, b);
    }

    if (isObject(a) && isObject(b)) {
      return isEqualObjects(a, b);
    }
  }

  return a === b;
}

//#region arrays

function isEqualArrays<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }

  return true;
}

//#endregion

//#region dates

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function isEqualDates(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

//#endregion

//#region maps

function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

function isEqualMaps<K, V>(a: Map<K, V>, b: Map<K, V>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const [key, value] of a) {
    if (b.get(key) !== value) {
      return false;
    }
  }

  return true;
}

//#endregion

//#region sets

function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

function isEqualSets<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
}

//#endregion

//#region objects

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value != null;
}

function isEqualObjects<T extends object>(a: T, b: T): boolean {
  if (a.constructor !== b.constructor) {
    return false;
  }

  const aKeys = getKeys(a);
  const bKeys = getKeys(b);

  if (!isEqualArrays(aKeys, bKeys)) {
    return false;
  }

  if (aKeys.length === 0) {
    return true;
  }

  return aKeys.every((key) => isEqual(a[key], b[key]));
}

//#endregion
