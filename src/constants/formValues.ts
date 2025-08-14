import { Category, Goal, SafeSubtask, Task } from "../types/schemas";
import { Status } from "../types/variables";

export const defaultGoal: Goal = {
  id: -1,
  name: "",
  description: "",
  isImportant: false,
  points: 0,
  deadline: new Date().toISOString(),
  status: Status.PENDING,
  priority: 1,
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const defaultCategory: Category = {
  id: -1,
  name: '',
  color: '#cccccc',
  icon: "shield-outline"
};

export const defaultTask: Task = {
  id: -1,
  title: '',
  description: '',
  isCompleted: false,
  isImportant: false,
  points: 0,
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export   const defaultSubtask: SafeSubtask = {
    title: '',
    isCompleted: false,
    points: 0,
    isImportant: false,
  };