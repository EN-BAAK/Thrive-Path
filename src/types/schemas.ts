import { Status } from "./variables";

export type Goal = {
  id: number;
  name: string;
  description?: string;
  isImportant?: boolean;
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
  createdAt: string;
  updatedAt: string;
};

export type SafeTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type Subtask = {
  id: number;
  title: string;
  isCompleted: boolean;
  isImportant: boolean;
  parentTaskId: number;
};

export type SafeSubtask = Omit<Subtask, 'id' | 'parentTaskId'>;

export type TaskWithCategoryAndSubtasks = Task & {
  categoryName: string;
  categoryColor: string;
  subtasks: Subtask[];
};


export type Challenge = {
  id: number;
  title: string;
  description?: string;
  targetValue?: number;
  startDate: string;
  endDate: string;
  maxHearts?: number;
  currentHearts?: number;
  maxStars?: number;
  currentStars?: number;
  isCompleted: boolean;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
};

export type SafeChallenge = Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>;

export type TimerLog = {
  id: number;
  duration: string;
  type: string;
  description?: string;
};

export type SafeTimerLog = Omit<TimerLog, 'id'>;
