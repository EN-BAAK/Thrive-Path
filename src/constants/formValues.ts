import { Category, Challenge, Goal, Habit, SafeSubtask, Task } from "../types/schemas";
import { HabitType, RepeatInterval, Status } from "../types/variables";

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

export const defaultSubtask: SafeSubtask = {
  title: '',
  isCompleted: false,
  points: 0,
  isImportant: false,
};

export const defaultHabit: Habit = {
  id: -1,
  title: '',
  description: '',
  habitType: HabitType.GOOD,
  winPoints: 0,
  losePoints: 0,
  repeatInterval: RepeatInterval.DAILY,
  customIntervalDays: undefined,
  repeatWeekDay: undefined,
  repeatMonthDay: undefined,
  deadline: undefined,
  categoryId: undefined,
  goalId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const defaultChallenge: Challenge = {
  id: -1,
  title: '',
  description: '',
  points: 0,
  penaltyPoints: 0,
  targetValue: 0,
  maxHearts: 0,
  maxStars: 0,
  currentHearts: 0,
  currentStars: 0,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isCompleted: false
};
