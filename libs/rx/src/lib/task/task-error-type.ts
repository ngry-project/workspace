import { TaskStatus } from './task-status';

export interface TaskErrorType<Error> {
  [TaskStatus.INITIAL]: undefined;
  [TaskStatus.PENDING]: undefined;
  [TaskStatus.COMPLETE]: undefined;
  [TaskStatus.FAILED]: Error;
}
