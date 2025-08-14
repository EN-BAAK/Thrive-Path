import { Status } from "./variables";

export type Goal = {
  id: number;
  name: string;
  description?: string;
  isImportant?: boolean;
  points: number;
  deadline: string;
  status?: Status;
  priority?: number;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
};

export type SafetyGoal = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;

export type GoalWCategory = Goal & {
  categoryName: string,
  categoryColor: string
}

export type Category = {
  id: number,
  name: string,
  color?: string,
  icon: string,
}

export type SafeCategory = Omit<Category, 'id'>;

export type Task = {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  isImportant: boolean;
  categoryId?: number;
  points: number,
  createdAt: string;
  updatedAt: string;
};

export type SafeTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type Subtask = {
  id: number;
  title: string;
  isCompleted: boolean;
  points: number,
  isImportant: boolean;
  parentTaskId: number;
};

export type SafeSubtask = Omit<Subtask, 'id' | 'parentTaskId'>;

export type TaskWithCategoryAndSubtasks = Task & {
  categoryName: string;
  categoryColor: string;
  subtasks: Subtask[];
};
