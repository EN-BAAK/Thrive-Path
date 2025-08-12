import { getDatabase } from '../db';
import { Category, SafeCategory } from '../../types/schemas';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { Condition } from '../../types/variables';

initializeDatabase();

const TABLE_NAME = 'categories';
const isTimestamp = false;

export const createCategory = async (category: SafeCategory): Promise<void> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    await categoriesDB.insert(category, isTimestamp);
  } catch (error) {
    console.error('[CREATE_CATEGORY] Error:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await categoriesDB.findAll<Category>([], 'id DESC');
  } catch (error) {
    console.error('[GET_CATEGORIES] Error:', error);
    throw error;
  }
};

export const updateCategory = async (id: number, updates: Partial<Category>): Promise<void> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    await categoriesDB.update(id, updates, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CATEGORY] Error:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    await categoriesDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_CATEGORY] Error:', error);
    throw error;
  }
};

export const findCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await categoriesDB.findByPk<Category>(id);
  } catch (error) {
    console.error('[FIND_CATEGORY_BY_ID] Error:', error);
    throw error;
  }
};

export const findCategory = async (conditions: Condition[]): Promise<Category | null> => {
  try {
    const categoriesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await categoriesDB.findOne<Category>(conditions);
  } catch (error) {
    console.error('[FIND_CATEGORY] Error:', error);
    throw error;
  }
};
