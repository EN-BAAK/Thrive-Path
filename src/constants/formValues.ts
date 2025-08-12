import { Category, Goal } from "../types/schemas";

export const defaultGoal: Goal = {
  id: -1,
  name: "",
  description: "",
  isImportant: false,
  points: 0,
  deadline: new Date().toISOString(),
  status: "PENDING",
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