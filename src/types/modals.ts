import { Category, Goal } from "./schemas";

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
