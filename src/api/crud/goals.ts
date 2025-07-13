import { getDatabase } from '../db';
import { Goal } from '../../types/schemas';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';

initializeDatabase()

const TABLE_NAME = 'goals';
const isTimestamp = true;

export const createGoal = async (goal: Goal) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)
    return await goalsDB.insert(goal, isTimestamp);
  } catch (error) {
    console.error('[CREATE_GOAL] Error:', error);
    throw error;
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)

    return await goalsDB.findAll<Goal>([], 'createdAt DESC');
  } catch (error) {
    console.error('[GET_GOALS] Error:', error);
    throw error;
  }
};

export const updateGoal = async (id: number, updates: Partial<Goal>) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)

    return await goalsDB.update(id, updates);
  } catch (error) {
    console.error('[UPDATE_GOAL] Error:', error);
    throw error;
  }
};

export const deleteGoal = async (id: number) => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)

    return await goalsDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_GOAL] Error:', error);
    throw error;
  }
};

export const findGoalById = async (id: number): Promise<Goal | null> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)

    return await goalsDB.findByPk<Goal>(id);
  } catch (error) {
    console.error('[FIND_GOAL_BY_ID] Error:', error);
    throw error;
  }
};

export const findGoal = async (conditions: any[]): Promise<Goal | null> => {
  try {
    const goalsDB = await initializeTableFunctions(getDatabase, TABLE_NAME)

    return await goalsDB.findOne<Goal>(conditions);
  } catch (error) {
    console.error('[FIND_GOAL] Error:', error);
    throw error;
  }
};
