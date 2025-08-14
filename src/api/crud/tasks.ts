import { getDatabase } from '../db';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { booleanToNumber } from '../../misc/helpers';
import { Task, TaskWithCategoryAndSubtasks, SafeTask, SafeSubtask, Subtask } from '../../types/schemas';

initializeDatabase();

const TASKS_TABLE = 'tasks';
const SUBTASKS_TABLE = 'subtasks';
const taskIsTimestamp = true;
const subtaskIsTimestamp = false

export const createTask = async (task: SafeTask) => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    return await tasksDB.insert(task, taskIsTimestamp);
  } catch (error) {
    console.error('[CREATE_TASK] Error:', error);
    throw error;
  }
};

export const createSubtask = async (subtask: SafeSubtask, parentTaskId: number) => {
  try {
    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    return await subtasksDB.insert({ ...subtask, parentTaskId }, subtaskIsTimestamp);
  } catch (error) {
    console.error('[CREATE_SUBTASK] Error:', error);
    throw error;
  }
};

export const findAllTasks = async (): Promise<TaskWithCategoryAndSubtasks[]> => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    console.log("Initialize", tasksDB)
    const allTasks = await tasksDB.findAll<TaskWithCategoryAndSubtasks>(
      [],
      'tasks.createdAt DESC',
      [
        {
          through: 'categories',
          on: 'tasks.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' }
          ]
        },
      ],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'isImportant', alias: 'isImportant' },
        { column: 'points', alias: 'points' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );
    console.log("Data", allTasks)
    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    for (const task of allTasks) {
      const subtasks = await subtasksDB.findAll<Subtask>(
        [{ table: 'subtasks', field: 'parentTaskId', value: task.id }]
      );
      console.log("Subtasks", subtasks)
      task.subtasks = subtasks;
    }


    return allTasks;
  } catch (error) {
    console.error('[FIND_ALL_TASKS] Error:', error);
    throw error;
  }
};

export const findTaskById = async (id: number): Promise<TaskWithCategoryAndSubtasks | null> => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);

    const task = await tasksDB.findOne<TaskWithCategoryAndSubtasks>(
      [{ field: 'id', value: id }],
      [
        {
          through: 'categories',
          on: 'tasks.categoryId = categories.id',
          type: 'LEFT',
          columns: [
            { column: 'name', alias: 'categoryName' },
            { column: 'color', alias: 'categoryColor' }
          ]
        }
      ],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'isImportant', alias: 'isImportant' },
        { column: 'points', alias: 'points' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );

    if (!task) return null;

    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    const subtasks = await subtasksDB.findAll<Subtask>(
      [{ table: 'subtasks', field: 'parentTaskId', value: task.id }]
    );
    task.subtasks = subtasks;

    return task;
  } catch (error) {
    console.error('[FIND_TASK_BY_ID] Error:', error);
    throw error;
  }
};

export const updateTask = async (id: number, updates: Partial<Task>) => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    return await tasksDB.update(id, updates, taskIsTimestamp);
  } catch (error) {
    console.error('[UPDATE_TASK] Error:', error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    return await tasksDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_TASK] Error:', error);
    throw error;
  }
};

export const deleteSubtask = async (id: number) => {
  try {
    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    return await subtasksDB.deleteById(id);
  } catch (error) {
    console.error('[DELETE_SUBTASK] Error:', error);
    throw error;
  }
};

export const updateTaskImportantById = async (id: number, isImportant: boolean) => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    return await tasksDB.update(id, { isImportant: booleanToNumber(isImportant) });
  } catch (error) {
    console.error('[UPDATE_TASK_IMPORTANT] Error:', error);
    throw error;
  }
};
export const updateSubtaskImportantById = async (id: number, isImportant: boolean) => {
  try {
    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    return await subtasksDB.update(id, { isImportant: booleanToNumber(isImportant) }, subtaskIsTimestamp);
  } catch (error) {
    console.error('[UPDATE_SUBTASK_IMPORTANT] Error:', error);
    throw error;
  }
};

export const updateTaskIsCompletedById = async (id: number, isCompleted: boolean) => {
  try {
    const tasksDB = await initializeTableFunctions(getDatabase, TASKS_TABLE);
    return await tasksDB.update(id, { isCompleted: booleanToNumber(isCompleted) });
  } catch (error) {
    console.error('[UPDATE_TASK_COMPLETED] Error:', error);
    throw error;
  }
};

export const updateSubtaskCompletedById = async (id: number, isCompleted: boolean) => {
  try {
    const subtasksDB = await initializeTableFunctions(getDatabase, SUBTASKS_TABLE);
    return await subtasksDB.update(id, { isCompleted: booleanToNumber(isCompleted) }, subtaskIsTimestamp);
  } catch (error) {
    console.error('[UPDATE_SUBTASK_COMPLETED] Error:', error);
    throw error;
  }
};
