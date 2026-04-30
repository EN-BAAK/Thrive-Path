import { Category, Challenge, Goal, SafeSubtask, Task } from "../types/schemas";
import {  Status } from "../types/variables";

export const defaultGoal: Goal = {
  id: -1,
  name: "",
  description: "",
  isImportant: false,
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
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const defaultSubtask: SafeSubtask = {
  title: '',
  isCompleted: false,
  isImportant: false,
};

export const defaultChallenge: Challenge = {
  id: -1,
  title: '',
  description: '',
  maxHearts: 0,
  maxStars: 0,
  currentHearts: 0,
  currentStars: 0,
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isCompleted: false,
};
