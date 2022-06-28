import { of, throwError } from 'rxjs';
import { ObservableSpy } from '../testing/observable-spy';
import { task } from './task';
import { TaskState } from './task-state';

describe('task', () => {
  describe('when task completes successfully', () => {
    const task$ = task(() => of(123));
    let stateSpy: ObservableSpy<TaskState<number>>;

    beforeEach(async () => {
      stateSpy = new ObservableSpy(task$);

      await stateSpy.whenComplete();

      expect(stateSpy.values.length).toBe(2);
    });

    it('should emit a pending state', () => {
      expect(stateSpy.values[0]).toStrictEqual(TaskState.pending());
    });

    it('should emit a complete state', () => {
      expect(stateSpy.values[1]).toStrictEqual(TaskState.complete(123));
    });
  });

  describe('when task completes with failure', () => {
    const task$ = task(() => throwError(() => new Error('Message')));
    let stateSpy: ObservableSpy<TaskState<never>>;

    beforeEach(async () => {
      stateSpy = new ObservableSpy(task$);

      await stateSpy.whenComplete();

      expect(stateSpy.values.length).toBe(2);
    });

    it('should emit a pending state', () => {
      expect(stateSpy.values[0]).toStrictEqual(TaskState.pending());
    });

    it('should emit a failed state', () => {
      expect(stateSpy.values[1]).toStrictEqual(
        TaskState.failed(new Error('Message')),
      );
    });
  });
});
