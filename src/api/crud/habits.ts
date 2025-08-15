import { getDatabase } from '../db';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { booleanToNumber } from '../../misc/helpers';
import { Habit, SafeHabit } from '../../types/schemas';

initializeDatabase();

const TABLE_NAME = 'habits';
const isTimestamp = true;

export const createHabit = async (habit: SafeHabit) => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.insert(habit, isTimestamp);
  } catch (error) {
    console.error('[CREATE_HABIT] Error:', error);
    throw error;
  }
};

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.findAll<Habit>(
      [],
      'habits.createdAt DESC',
      [
        {
          through: 'categories',
          on: 'habits.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' }
          ]
        },
        {
          through: 'goals',
          on: 'habits.goalId = goals.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalName' }
          ]
        }
      ],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'habitType', alias: 'habitType' },
        { column: 'winPoints', alias: 'winPoints' },
        { column: 'losePoints', alias: 'losePoints' },
        { column: 'repeatInterval', alias: 'repeatInterval' },
        { column: 'customIntervalDays', alias: 'customIntervalDays' },
        { column: 'maxHearts', alias: 'maxHearts' },
        { column: 'currentHearts', alias: 'currentHearts' },
        { column: 'maxStars', alias: 'maxStars' },
        { column: 'currentStars', alias: 'currentStars' },
        { column: 'deadline', alias: 'deadline' },
        { column: 'isActive', alias: 'isActive' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'goalId', alias: 'goalId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );
  } catch (error) {
    console.error('[GET_HABITS] Error:', error);
    throw error;
  }
};

export const getHabit = async (id: number): Promise<Habit | null> => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.findOne<Habit>(
      [{ field: 'id', value: id }],
      [
        {
          through: 'categories',
          on: 'habits.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' }
          ]
        },
        {
          through: 'goals',
          on: 'habits.goalId = goals.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalName' }
          ]
        }
      ],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'habitType', alias: 'habitType' },
        { column: 'winPoints', alias: 'winPoints' },
        { column: 'losePoints', alias: 'losePoints' },
        { column: 'repeatInterval', alias: 'repeatInterval' },
        { column: 'customIntervalDays', alias: 'customIntervalDays' },
        { column: 'maxHearts', alias: 'maxHearts' },
        { column: 'currentHearts', alias: 'currentHearts' },
        { column: 'maxStars', alias: 'maxStars' },
        { column: 'currentStars', alias: 'currentStars' },
        { column: 'deadline', alias: 'deadline' },
        { column: 'isActive', alias: 'isActive' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'goalId', alias: 'goalId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );
  } catch (error) {
    console.error('[GET_HABIT] Error:', error);
    throw error;
  }
};

export const updateHabit = async (id: number, updates: Partial<Habit>) => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, updates, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_HABIT] Error:', error);
    throw error;
  }
};

export const deleteHabit = async (id: number) => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_HABIT] Error:', error);
    throw error;
  }
};

// Custom updates
export const toggleHabitActive = async (id: number, isActive: boolean) => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, { isActive: booleanToNumber(isActive) }, isTimestamp);
  } catch (error) {
    console.error('[TOGGLE_HABIT_ACTIVE] Error:', error);
    throw error;
  }
};

export const addHeart = async (id: number) => {
  try {
    const habit = await getHabit(id);
    if (!habit) throw new Error('Habit not found');
    const newHearts = habit.currentHearts + 1;
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, { currentHearts: newHearts }, isTimestamp);
  } catch (error) {
    console.error('[ADD_HEART] Error:', error);
    throw error;
  }
};

export const removeHeart = async (id: number) => {
  try {
    const habit = await getHabit(id);
    if (!habit) throw new Error('Habit not found');
    const newHearts = Math.max(0, habit.currentHearts - 1);
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, { currentHearts: newHearts }, isTimestamp);
  } catch (error) {
    console.error('[REMOVE_HEART] Error:', error);
    throw error;
  }
};

export const addStar = async (id: number) => {
  try {
    const habit = await getHabit(id);
    if (!habit) throw new Error('Habit not found');
    const newStars = habit.currentStars + 1;
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, { currentStars: newStars }, isTimestamp);
  } catch (error) {
    console.error('[ADD_STAR] Error:', error);
    throw error;
  }
};

export const removeStar = async (id: number) => {
  try {
    const habit = await getHabit(id);
    if (!habit) throw new Error('Habit not found');
    const newStars = Math.max(0, habit.currentStars - 1);
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await habitsDB.update(id, { currentStars: newStars }, isTimestamp);
  } catch (error) {
    console.error('[REMOVE_STAR] Error:', error);
    throw error;
  }
};
