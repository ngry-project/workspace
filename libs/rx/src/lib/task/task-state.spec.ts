import { TaskState } from './task-state';

describe('TaskState', () => {
  describe('constructor', () => {
    describe.each([
      [
        TaskState.initial(),
        {
          isInitial: true,
          isPending: false,
          isComplete: false,
          isFailed: false,
          result: undefined,
          error: undefined,
        },
      ],
      [
        TaskState.pending(),
        {
          isInitial: false,
          isPending: true,
          isComplete: false,
          isFailed: false,
          result: undefined,
          error: undefined,
        },
      ],
      [
        TaskState.complete(123),
        {
          isInitial: false,
          isPending: false,
          isComplete: true,
          isFailed: false,
          result: 123,
          error: undefined,
        },
      ],
      [
        TaskState.failed({ message: 'Some' }),
        {
          isInitial: false,
          isPending: false,
          isComplete: false,
          isFailed: true,
          result: undefined,
          error: { message: 'Some' },
        },
      ],
    ])(
      'given %o',
      (
        state,
        { isInitial, isPending, isComplete, isFailed, result, error },
      ) => {
        it.each([[isInitial]])('should have isInitial = %o', () => {
          expect(state.isInitial()).toBe(isInitial);
        });

        it.each([[isPending]])('should have isPending = %o', () => {
          expect(state.isPending()).toBe(isPending);
        });

        it.each([[isComplete]])('should have isComplete = %o', () => {
          expect(state.isComplete()).toBe(isComplete);
        });

        it.each([[isFailed]])('should have isFailed = %o', () => {
          expect(state.isFailed()).toBe(isFailed);
        });

        it.each([[result]])('should have result = %o', () => {
          expect(state.result).toStrictEqual(result);
        });

        it.each([[error]])('should have error = %o', () => {
          expect(state.error).toStrictEqual(error);
        });
      },
    );
  });

  describe('static isInitial', () => {
    describe.each([
      [TaskState.initial(), true],
      [TaskState.pending(), false],
      [TaskState.complete(123), false],
      [TaskState.failed({}), false],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should return %o', () => {
        expect(TaskState.isInitial(state)).toBe(expected);
      });
    });
  });

  describe('static isPending', () => {
    describe.each([
      [TaskState.initial(), false],
      [TaskState.pending(), true],
      [TaskState.complete(123), false],
      [TaskState.failed({}), false],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should return %o', () => {
        expect(TaskState.isPending(state)).toBe(expected);
      });
    });
  });

  describe('static isComplete', () => {
    describe.each([
      [TaskState.initial(), false],
      [TaskState.pending(), false],
      [TaskState.complete(123), true],
      [TaskState.failed({}), false],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should return %o', () => {
        expect(TaskState.isComplete(state)).toBe(expected);
      });
    });
  });

  describe('static isFailed', () => {
    describe.each([
      [TaskState.initial(), false],
      [TaskState.pending(), false],
      [TaskState.complete(123), false],
      [TaskState.failed({}), true],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should return %o', () => {
        expect(TaskState.isFailed(state)).toBe(expected);
      });
    });
  });

  describe('map', () => {
    describe.each([
      [TaskState.initial(), TaskState.initial()],
      [TaskState.pending(), TaskState.pending()],
      [TaskState.complete(123), TaskState.complete('123')],
      [TaskState.failed({}), TaskState.failed({})],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should map to %o', () => {
        expect(state.map(String)).toStrictEqual(expected);
      });
    });
  });

  describe('flatMap', () => {
    describe.each([
      [TaskState.initial(), TaskState.initial()],
      [TaskState.pending(), TaskState.pending()],
      [TaskState.complete(123), TaskState.complete('123')],
      [TaskState.failed({}), TaskState.failed({})],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should flat map to %o', () => {
        expect(
          state.flatMap((value) => TaskState.complete(String(value))),
        ).toStrictEqual(expected);
      });
    });
  });

  describe('catchMap', () => {
    describe.each([
      [TaskState.initial(), TaskState.initial()],
      [TaskState.pending(), TaskState.pending()],
      [TaskState.complete(123), TaskState.complete(123)],
      [TaskState.failed({ message: 'Some' }), TaskState.complete('Some')],
    ])('given %o', (state, expected) => {
      it.each([[expected]])('should catch map to %o', () => {
        expect(
          state.catchMap((error) =>
            TaskState.complete((error as Error).message),
          ),
        ).toStrictEqual(expected);
      });
    });
  });

  describe('forEach', () => {
    describe.each([
      [TaskState.initial(), { times: 0, arg: undefined }],
      [TaskState.pending(), { times: 0, arg: undefined }],
      [TaskState.complete(123), { times: 1, arg: 123 }],
      [TaskState.failed({}), { times: 0, arg: undefined }],
    ])('given %o', (state, { times, arg }) => {
      let fn: jest.Mock;

      beforeEach(() => {
        fn = jest.fn();

        state.forEach(fn);
      });

      it(`should invoke callback ${times} times`, () => {
        expect(fn).toHaveBeenCalledTimes(times);
      });

      if (times > 0) {
        it.each([[arg]])(`should invoke callback with result = %o`, () => {
          expect(fn).toHaveBeenLastCalledWith(arg);
        });
      }
    });
  });

  describe('catchRun', () => {
    describe.each([
      [TaskState.initial(), { times: 0, arg: undefined }],
      [TaskState.pending(), { times: 0, arg: undefined }],
      [TaskState.complete(123), { times: 0, arg: undefined }],
      [TaskState.failed({}), { times: 1, arg: {} }],
    ])('given %o', (state, { times, arg }) => {
      let fn: jest.Mock;

      beforeEach(() => {
        fn = jest.fn();

        state.catchRun(fn);
      });

      it(`should invoke callback ${times} times`, () => {
        expect(fn).toHaveBeenCalledTimes(times);
      });

      if (times > 0) {
        it.each([[arg]])(`should invoke callback with error = %o`, () => {
          expect(fn).toHaveBeenLastCalledWith(arg);
        });
      }
    });
  });

  describe('chaining', () => {
    function sum(a: TaskState<number>, b: TaskState<number>): number | null {
      return a
        .forEach((n1) => console.log('a', n1))
        .catchRun((e) => console.error('a', e))
        .catchMap(() => TaskState.complete(0))
        .flatMap((n1) =>
          b
            .forEach((n2) => console.log('b', n2))
            .catchRun((e) => console.error('b', e))
            .catchMap(() => TaskState.complete(0))
            .flatMap((n2) => TaskState.complete([n1, n2])),
        )
        .map(([n1, n2]) => n1 + n2)
        .forEach((result) => console.log('result', result))
        .catchRun((e) => console.error('result', e))
        .getResult(() => null);
    }

    let log: jest.SpyInstance;
    let error: jest.SpyInstance;

    beforeEach(() => {
      log = jest.spyOn(console, 'log').mockImplementation();
      error = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      log.mockClear();
      error.mockClear();
    });

    describe.each<
      [
        a: TaskState<number>,
        b: TaskState<number>,
        result: number | null,
        logs: (readonly any[])[],
        errors: (readonly any[])[],
      ]
    >([
      [TaskState.initial(), TaskState.initial(), null, [], []],
      [TaskState.complete(1), TaskState.pending(), null, [['a', 1]], []],
      [TaskState.pending(), TaskState.complete(2), null, [], []],
      [
        TaskState.complete(1),
        TaskState.complete(2),
        3,
        [
          ['a', 1],
          ['b', 2],
          ['result', 3],
        ],
        [],
      ],
      [
        TaskState.failed({}),
        TaskState.failed({}),
        0,
        [['result', 0]],
        [
          ['a', {}],
          ['b', {}],
        ],
      ],
      [
        TaskState.complete(1),
        TaskState.failed({}),
        1,
        [
          ['a', 1],
          ['result', 1],
        ],
        [['b', {}]],
      ],
    ])('given %o and %o', (a, b, result, logs, errors) => {
      it.each([[result]])('should result to %o', () => {
        expect(sum(a, b)).toBe(result);
      });

      it('should run effects', () => {
        sum(a, b);

        expect(log.mock.calls).toEqual(logs);

        expect(error.mock.calls).toEqual(errors);
      });
    });
  });
});
