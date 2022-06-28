import { TaskErrorType } from './task-error-type';
import { TaskResultType } from './task-result-type';
import { TaskStatus } from './task-status';

/**
 * Represents a state of an async task.
 * @see task
 */
export class TaskState<
  Result = unknown,
  Error = unknown,
  Status extends TaskStatus = TaskStatus,
> {
  private readonly status: Status;

  readonly result: TaskResultType<Result>[Status];

  readonly error: TaskErrorType<Error>[Status];

  /**
   * Creates an initial task state.
   */
  static initial<Result = unknown, Error = unknown>(): TaskState<
    Result,
    Error,
    TaskStatus.INITIAL
  > {
    return new TaskState(TaskStatus.INITIAL, undefined, undefined);
  }

  /**
   * Creates a pending task state.
   */
  static pending<Result = unknown, Error = unknown>(): TaskState<
    Result,
    Error,
    TaskStatus.PENDING
  > {
    return new TaskState(TaskStatus.PENDING, undefined, undefined);
  }

  /**
   * Creates a complete task state.
   */
  static complete<Result = unknown, Error = unknown>(
    result: Result,
  ): TaskState<Result, Error, TaskStatus.COMPLETE> {
    return new TaskState(TaskStatus.COMPLETE, result, undefined);
  }

  /**
   * Creates a failed task state.
   */
  static failed<Result = unknown, Error = unknown>(
    error: Error,
  ): TaskState<Result, Error, TaskStatus.FAILED> {
    return new TaskState(TaskStatus.FAILED, undefined, error);
  }

  static isInitial<Result, Error>(
    state: TaskState<Result, Error>,
  ): state is TaskState<Result, Error, TaskStatus.INITIAL> {
    return state.isInitial();
  }

  static isPending<Result, Error>(
    state: TaskState<Result, Error>,
  ): state is TaskState<Result, Error, TaskStatus.PENDING> {
    return state.isPending();
  }

  static isComplete<Result, Error>(
    state: TaskState<Result, Error>,
  ): state is TaskState<Result, Error, TaskStatus.COMPLETE> {
    return state.isComplete();
  }

  static isFailed<Result, Error>(
    state: TaskState<Result, Error>,
  ): state is TaskState<Result, Error, TaskStatus.FAILED> {
    return state.isFailed();
  }

  private constructor(
    status: Status,
    result: TaskResultType<Result>[Status],
    error: TaskErrorType<Error>[Status],
  ) {
    this.status = status;
    this.result = result;
    this.error = error;
  }

  /**
   * Checks whether state is initial. Works as a type-guard.
   */
  isInitial(): this is TaskState<Result, Error, TaskStatus.INITIAL> {
    return this.status === TaskStatus.INITIAL;
  }

  /**
   * Checks whether state is pending. Works as a type-guard.
   */
  isPending(): this is TaskState<Result, Error, TaskStatus.PENDING> {
    return this.status === TaskStatus.PENDING;
  }

  /**
   * Checks whether state is complete. Works as a type-guard.
   */
  isComplete(): this is TaskState<Result, Error, TaskStatus.COMPLETE> {
    return this.status === TaskStatus.COMPLETE;
  }

  /**
   * Checks whether state is failed. Works as a type-guard.
   */
  isFailed(): this is TaskState<Result, Error, TaskStatus.FAILED> {
    return this.status === TaskStatus.FAILED;
  }

  map<T>(project: (result: Result) => T): TaskState<T, Error, Status> {
    if (this.isComplete()) {
      return TaskState.complete(project(this.result)) as any;
    }

    return this as any;
  }

  flatMap<T, E, S extends TaskStatus>(
    project: (result: Result) => TaskState<T, E, S>,
  ): TaskState<T, E | Error, S | Status> {
    if (this.isComplete()) {
      return project(this.result) as any;
    }

    return this as any;
  }

  catchMap<T, E, S extends TaskStatus>(
    handle: (error: Error) => TaskState<T, E, S>,
  ): TaskState<T | Result, E, S | Status> {
    if (this.isFailed()) {
      return handle(this.error) as any;
    }

    return this as any;
  }

  forEach(fn: (result: Result) => void): this {
    if (this.isComplete()) {
      fn(this.result);
    }

    return this;
  }

  catchRun(fn: (error: Error) => void): this {
    if (this.isFailed()) {
      fn(this.error);
    }

    return this;
  }

  getResult<T>(fallback: () => T): Result | T {
    if (this.isComplete()) {
      return this.result;
    }

    return fallback();
  }
}
