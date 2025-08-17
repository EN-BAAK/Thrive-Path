import { getDatabase } from '../db';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { Habit, HabitFetchedQuery, HabitWithCategory, SafeHabit } from '../../types/schemas';

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

export const getHabit = async (id: number): Promise<HabitWithCategory | null> => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);

    const habit = await habitsDB.findOne<HabitFetchedQuery>(
      [{ field: 'id', value: id }],
      [
        {
          through: 'categories',
          as: 'habitCategory',
          on: 'habits.categoryId = habitCategory.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'habitCategoryName' },
            { column: 'color', alias: 'habitCategoryColor' }
          ]
        },
        {
          through: 'goals',
          on: 'habits.goalId = goals.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalName' },
            { column: 'categoryId', alias: 'goalCategoryId' }
          ]
        },
        {
          through: 'categories',
          as: 'goalCategory',
          on: 'goals.categoryId = goalCategory.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalCategoryName' },
            { column: 'color', alias: 'goalCategoryColor' }
          ]
        }
      ]
    );

    if (!habit) return null;

    if (!habit.categoryId && habit.goalCategoryId) {
      habit.categoryName = habit.goalCategoryName;
      habit.categoryColor = habit.goalCategoryColor;
    } else {
      habit.categoryName = habit.habitCategoryName;
      habit.categoryColor = habit.habitCategoryColor;
    }

    delete habit.habitCategoryName;
    delete habit.habitCategoryColor;
    delete habit.goalCategoryName;
    delete habit.goalCategoryColor;

    return habit;
  } catch (error) {
    console.error('[GET_HABIT] Error:', error);
    throw error;
  }
};

export const getHabits = async (): Promise<HabitWithCategory[]> => {
  try {
    const habitsDB = await initializeTableFunctions(getDatabase, TABLE_NAME);

    const habits = await habitsDB.findAll<HabitFetchedQuery>(
      [],
      'habits.createdAt DESC',
      [
        {
          through: 'categories',
          as: 'habitCategory',
          on: 'habits.categoryId = habitCategory.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'habitCategoryName' },
            { column: 'color', alias: 'habitCategoryColor' }
          ]
        },
        {
          through: 'goals',
          on: 'habits.goalId = goals.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalName' },
            { column: 'categoryId', alias: 'goalCategoryId' }
          ]
        },
        {
          through: 'categories',
          as: 'goalCategory',
          on: 'goals.categoryId = goalCategory.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'goalCategoryName' },
            { column: 'color', alias: 'goalCategoryColor' }
          ]
        }
      ]
    );

    return habits.map(habit => {
      if (!habit.categoryId && habit.goalCategoryId) {
        habit.categoryName = habit.goalCategoryName;
        habit.categoryColor = habit.goalCategoryColor;
      } else {
        habit.categoryName = habit.habitCategoryName;
        habit.categoryColor = habit.habitCategoryColor;
      }

      delete habit.habitCategoryName;
      delete habit.habitCategoryColor;
      delete habit.goalCategoryName;
      delete habit.goalCategoryColor;
      delete habit.goalCategoryId;

      return habit;
    });
  } catch (error) {
    console.error('[GET_HABITS] Error:', error);
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
