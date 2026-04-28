import { Category, Challenge, Goal, Task } from "./schemas";
import { QueryKey } from "./variables";

export type Modal = {
  visible: boolean,
  onClose: () => void,
  queryKey: QueryKey[]
}

export type AddEditGoalModalProps = {
  initialGoal: Goal;
} & Modal

export type AddEditCategoryModalProps = {
  initialCategory: Category;
} & Modal;

export type AddEditTaskModalProps = {
  initialTask: Task;
} & Modal;

export type AddSubtaskModalProps = {
  parentTaskId: number;
} & Modal;

export type AddEditChallengeModalProps = {
  initialChallenge: Challenge
} & Modal