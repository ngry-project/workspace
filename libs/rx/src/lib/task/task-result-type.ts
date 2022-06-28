import { TaskStatus } from './task-status';

export interface TaskResultType<Result> {
  [TaskStatus.INITIAL]: undefined;
  [TaskStatus.PENDING]: undefined;
  [TaskStatus.COMPLETE]: Result;
  [TaskStatus.FAILED]: undefined;
}
