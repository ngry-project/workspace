import { expect } from '@jest/globals';
import { Subject } from 'rxjs';
import { ObservableSpy } from './observable-spy';

describe('ObservableSpy', () => {
  let subject: Subject<number>;
  let spy: ObservableSpy<number>;

  beforeEach(() => {
    subject = new Subject();
    spy = new ObservableSpy(subject);
  });

  describe('values', () => {
    describe('when not emitted any values yet', () => {
      it('should be an empty array', () => {
        expect(spy.values).toEqual([]);
      });
    });

    describe('when emitted some values', () => {
      beforeEach(() => {
        subject.next(1);
        subject.next(3);
        subject.next(5);
      });

      it('should accumulate values in ordered array', () => {
        expect(spy.values).toEqual([1, 3, 5]);
      });
    });
  });

  describe('error', () => {
    describe('when source is not broken', () => {
      it('should be undefined', () => {
        expect(spy.error).toBeUndefined();
      });
    });

    describe('when source is broken', () => {
      const error = new Error('Something went wrong');

      beforeEach(() => {
        subject.error(error);
      });

      it('should contain an error', () => {
        expect(spy.error).toBe(error);
      });
    });
  });

  describe('complete', () => {
    describe('when source is not completed', () => {
      it('should be false', () => {
        expect(spy.complete).toBe(false);
      });
    });

    describe('when source is completed', () => {
      beforeEach(() => {
        subject.complete();
      });

      it('should be true', () => {
        expect(spy.complete).toBe(true);
      });
    });
  });

  describe('whenCount', () => {
    let resolved = false;

    beforeEach(() => {
      spy.whenCount(3).then(() => {
        resolved = true;
      });
    });

    describe('when count of emitted values did not a reach given value', () => {
      beforeEach(() => {
        subject.next(1);
        subject.next(3);
      });

      it('should not resolve', () => {
        expect(resolved).toBe(false);
      });
    });

    describe('when count of emitted values reached given value', () => {
      beforeEach(() => {
        subject.next(1);
        subject.next(3);
        subject.next(5);
      });

      it('should resolve', () => {
        expect(resolved).toBe(true);
      });
    });
  });

  describe('whenComplete', () => {
    let resolved = false;

    beforeEach(() => {
      spy.whenComplete().then(() => {
        resolved = true;
      });
    });

    describe('when not completed', () => {
      it('should not resolve', () => {
        expect(resolved).toBe(false);
      });
    });

    describe('when completed', () => {
      beforeEach(() => {
        subject.complete();
      });

      it('should resolve', () => {
        expect(resolved).toBe(true);
      });
    });
  });

  describe('whenError', () => {
    let resolved = false;

    beforeEach(() => {
      spy.whenError().then(() => {
        resolved = true;
      });
    });

    describe('when not failed', () => {
      it('should not resolve', () => {
        expect(resolved).toBe(false);
      });
    });

    describe('when completed', () => {
      beforeEach(() => {
        subject.error(new Error());
      });

      it('should resolve', () => {
        expect(resolved).toBe(true);
      });
    });
  });

  describe('dispose', () => {
    beforeEach(() => {
      spy.dispose();
    });

    it('should stop values accumulation', () => {
      subject.next(1);
      subject.next(3);
      subject.next(5);

      expect(spy.values).toEqual([]);
    });

    it('should stop error tracking', () => {
      subject.error(new Error('Something went wrong'));

      expect(spy.error).toBeUndefined();
    });

    it('should stop completion tracking', () => {
      subject.complete();

      expect(spy.complete).toBe(false);
    });
  });
});
