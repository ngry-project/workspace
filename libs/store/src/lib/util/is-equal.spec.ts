import { isEqual } from './is-equal';

class Car {
  constructor(readonly brand: string, readonly model: string) {}
}

describe('isEqual', () => {
  it('should compare primitive types', () => {
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(undefined, null)).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(null, null)).toBe(true);

    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, 0)).toBe(false);
    expect(isEqual(0, 1)).toBe(false);

    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(false, true)).toBe(false);
    expect(isEqual(false, false)).toBe(true);

    expect(isEqual('abc', 'abc')).toBe(true);
    expect(isEqual('abc', 'def')).toBe(false);
    expect(isEqual('def', 'abc')).toBe(false);
  });

  it('should compare dates', () => {
    const date1 = new Date(2022, 2, 24);
    const date2 = new Date(2022, 2, 24);
    const date3 = new Date(2022, 2, 23);

    expect(isEqual(date1, date1)).toBe(true);
    expect(isEqual(date1, date2)).toBe(true);
    expect(isEqual(date1, date3)).toBe(false);
  });

  it('should compare errors', () => {
    const error1 = new Error('Error');
    const error2 = new Error('Error');
    const error3 = new TypeError('Error');

    expect(isEqual(error1, error1)).toBe(true);
    expect(isEqual(error1, error2)).toBe(true);
    expect(isEqual(error1, error3)).toBe(false);
  });

  it('should compare class instances', () => {
    const car1 = new Car('Audi', 'eTron');
    const car2 = new Car('Audi', 'eTron');
    const car3 = new Car('BWM', 'x5');
    const car4: Car = { brand: 'Audi', model: 'eTron' };

    expect(isEqual(car1, car1)).toBe(true);
    expect(isEqual(car1, car2)).toBe(true);
    expect(isEqual(car1, car3)).toBe(false);
    expect(isEqual(car1, car4)).toBe(false);
  });

  it('should compare arrays', () => {
    expect(isEqual([1], [1])).toBe(true);
    expect(isEqual([1], [2])).toBe(false);
    expect(isEqual([2], [1])).toBe(false);
    expect(isEqual([1], [1, 2])).toBe(false);
    expect(isEqual([1, 2], [1])).toBe(false);
    expect(isEqual([{}], [])).toBe(false);
    expect(isEqual([], [{}])).toBe(false);
    expect(isEqual([{}], [{}])).toBe(true);
    expect(isEqual([{}], [{ a: 1 }])).toBe(false);
    expect(isEqual([{ a: 1 }], [{}])).toBe(false);
    expect(isEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('should compare maps', () => {
    const map1 = new Map([['Audi', 'eTron']]);
    const map2 = new Map([['Audi', 'eTron']]);
    const map3 = new Map([['BWM', 'x5']]);
    const map4 = new Map([
      ['Audi', 'eTron'],
      ['BWM', 'x5'],
    ]);

    expect(isEqual(map1, map1)).toBe(true);
    expect(isEqual(map1, map2)).toBe(true);
    expect(isEqual(map1, map3)).toBe(false);
    expect(isEqual(map1, map4)).toBe(false);
  });

  it('should compare sets', () => {
    const map1 = new Set(['Audi', 'BMW']);
    const map2 = new Set(['BMW', 'Audi']);
    const map3 = new Set(['BWM']);

    expect(isEqual(map1, map1)).toBe(true);
    expect(isEqual(map1, map2)).toBe(true);
    expect(isEqual(map1, map3)).toBe(false);
  });

  it('should compare nested objects with the same structure', () => {
    const obj1 = {
      number: 1,
      string: 'string',
      undefined: undefined,
      null: null,
      boolean: true,
      date: new Date(2022, 2, 24),
      typed: new Car('Audi', 'eTron'),
      error: new Error('Something went wrong'),
      group: {
        property: 'string',
        group: {
          property: 'value',
        },
      },
      arrayOfString: ['value'],
      arrayOfObject: [
        {
          property: 'value',
          group: {
            property: 'value',
          },
        },
      ],
    };

    const obj2 = {
      number: 1,
      string: 'string',
      undefined: undefined,
      null: null,
      boolean: true,
      date: new Date(2022, 2, 24),
      typed: new Car('Audi', 'eTron'),
      error: new Error('Something went wrong'),
      group: {
        property: 'string',
        group: {
          property: 'value',
        },
      },
      arrayOfString: ['value'],
      arrayOfObject: [
        {
          property: 'value',
          group: {
            property: 'value',
          },
        },
      ],
    };

    const obj3 = {
      number: 1,
      string: 'string',
      undefined: undefined,
      null: null,
      boolean: true,
      date: new Date(2022, 2, 24),
      typed: new Car('Audi', 'eTron'),
      error: new Error('Something went wrong'),
      group: {
        property: 'string',
        group: {
          property: 'value2', // this is different
        },
      },
      arrayOfString: ['value'],
      arrayOfObject: [
        {
          property: 'value',
          group: {
            property: 'value2', // this is different
          },
        },
      ],
    };

    expect(isEqual(obj1, obj1)).toBe(true);
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });
});
