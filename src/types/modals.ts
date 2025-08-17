import { Category, Goal, Habit, Task } from "./schemas";

export type Modal = {
  visible: boolean,
  onClose: () => void,
  onSave: () => void
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

export type AddEditHabitModalProps = {
  initialHabit: Habit;
} & Modal;