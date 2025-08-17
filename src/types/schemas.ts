import { HabitType, RepeatInterval, Status } from "./variables";

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

export type Habit = {
  id: number;
  title: string;
  description?: string;
  habitType: HabitType;
  winPoints: number;
  losePoints: number;
  repeatInterval?: RepeatInterval;
  customIntervalDays?: number;
  repeatWeekDay?: number,
  repeatMonthDay?: number,
  deadline?: string;
  categoryId?: number;
  goalId?: number;
  createdAt: string;
  updatedAt: string;
};

export type HabitWithCategory = Habit & {
  categoryName?: string,
  categoryColor?: string;
  goalName?: string,
}

export type HabitFetchedQuery = HabitWithCategory & {
  goalCategoryName?: string,
  goalCategoryColor?: string,
  habitCategoryName?: string,
  habitCategoryColor?: string
  goalCategoryId?: string,
};

export type SafeHabit = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

export type Challenge = {
  id: number;
  title: string;
  description?: string;
  points: number;
  penaltyPoints: number;
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
