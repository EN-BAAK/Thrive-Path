import { getDatabase } from '../db';
import { Goal, GoalWCategory, SafetyGoal } from '../../types/schemas';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { Condition } from '../../types/variables';

initializeDatabase();

const TABLE_NAME = 'goals';
const isTimestamp = true;

export const createGoal = async (goal: SafetyGoal) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.insert(goal, isTimestamp);
  } catch (error) {
    console.error('[CREATE_GOAL] Error:', error);
    throw error;
  }
};

export const findAllGoals = async (): Promise<GoalWCategory[]> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.findAll<GoalWCategory>(
      [],
      'goals.createdAt DESC',
      [
        {
          through: 'categories',
          on: 'goals.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' }
          ]
        }
      ],
      [
        { column: 'id', alias: "id" },
        { column: 'name', alias: "name" },
        { column: 'description', alias: "description" },
        { column: 'isImportant', alias: "isImportant" },
        { column: 'points', alias: "points" },
        { column: 'deadline', alias: "deadline" },
        { column: 'status', alias: "status" },
        { column: 'priority', alias: "priority" },
        { column: 'categoryId', alias: "categoryId" },
        { column: 'createdAt', alias: "createdAt" },
        { column: 'updatedAt', alias: "updatedAt" }
      ]
    );
  } catch (error) {
    console.error('[GET_GOALS] Error:', error);
    throw error;
  }
};

export const updateGoal = async (id: number, updates: Partial<Goal>) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.update(id, updates);
  } catch (error) {
    console.error('[UPDATE_GOAL] Error:', error);
    throw error;
  }
};

export const deleteGoal = async (id: number) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_GOAL] Error:', error);
    throw error;
  }
};

export const findGoalById = async (id: number): Promise<GoalWCategory | null> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.findOne<GoalWCategory>(
      [{ field: 'id', value: id }],
      [
        {
          through: 'categories',
          on: 'goals.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' },
            { column: 'icon', alias: 'categoryIcon' }
          ]
        }
      ],
      [
        { column: 'id' },
        { column: 'name' },
        { column: 'description' },
        { column: 'isImportant' },
        { column: 'points' },
        { column: 'deadline' },
        { column: 'status' },
        { column: 'priority' },
        { column: 'categoryId' },
        { column: 'createdAt' },
        { column: 'updatedAt' }
      ]
    );
  } catch (error) {
    console.error('[FIND_GOAL_BY_ID] Error:', error);
    throw error;
  }
};

export const findGoal = async (conditions: Condition[]): Promise<Goal | null> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await goalsDB.findOne<Goal>(conditions);
  } catch (error) {
    console.error('[FIND_GOAL] Error:', error);
    throw error;
  }
};
