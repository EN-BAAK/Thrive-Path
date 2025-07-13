import { Goal } from "./schemas";

export type AddEditGoalModalProps = {
  visible: boolean;
    onClose: () => void;
    onSave: (goal: Goal) => void;
    initialGoal?: Goal;
}