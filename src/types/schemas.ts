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
  categoryName?: string,
  categoryColor?: string
}

export type Category = {
  id: number,
  name: string,
  color?: string
}

export type SafeCategory = Omit<Category, 'id'>;