import { initializeDatabase } from '../schema';
import { booleanToNumber } from '../../misc/helpers';
import { Task, TaskWithCategoryAndSubtasks, SafeTask, SafeSubtask, Subtask } from '../../types/schemas';
import { initializeTableFunctions } from '../../misc/database';
import { PaginatedResult, Pagination } from '../../types/variables';

initializeDatabase();

const TASKS_TABLE = 'tasks';
const SUBTASKS_TABLE = 'subtasks';
const taskIsTimestamp = true;
const subtaskIsTimestamp = false

export const findAllTasks = async ({ limit = 10, offsetUnit = 0, page = 1 }: Pagination): Promise<PaginatedResult<TaskWithCategoryAndSubtasks>> => {
  const safePage = Math.max(1, page);
  const offset = (limit * (safePage - 1)) + offsetUnit;

  const pagination = { limit, offset };

  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);

    const { count, data } = await tasksDB.findAllWithCount<TaskWithCategoryAndSubtasks>(
      [],
      'createdAt DESC',
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
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ],
      pagination
    );


    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
    for (const task of data) {
      const subtasks = await subtasksDB.findAll<Subtask>(
        [{ table: 'subtasks', field: 'parentTaskId', value: task.id }]
      );
      task.subtasks = subtasks;
    }

    const totalPages = Math.ceil(count / limit);
    const hasMore = safePage < totalPages;
    const hasPrevious = safePage > 1;

    return {
      count,
      data,
      limit,
      page,
      totalPages,
      hasMore,
      hasPrevious,
      nextPage: hasMore ? page + 1 : null,
      prevPage: hasPrevious ? page - 1 : null,

    };
  } catch (error) {
    console.error('[FIND_ALL_TASKS] Error:', error);
    throw error;
  }
};

export const findTaskById = async (id: number): Promise<TaskWithCategoryAndSubtasks | null> => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);

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
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );

    if (!task) return null;

    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
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

export const createTask = async (task: SafeTask) => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);
    const createdTask = await tasksDB.insert(task, taskIsTimestamp) as Task;
    return await findTaskById(createdTask.id);
  } catch (error) {
    console.error('[CREATE_TASK] Error:', error);
    throw error;
  }
};

export const createSubtask = async ({ subtask, parentTaskId }: { subtask: SafeSubtask, parentTaskId: number }) => {
  try {
    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
    return await subtasksDB.insert({ ...subtask, parentTaskId }, subtaskIsTimestamp) as Subtask;
  } catch (error) {
    console.error('[CREATE_SUBTASK] Error:', error);
    throw error;
  }
};

export const updateTask = async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);
    const updatedTask = await tasksDB.update(id, updates, taskIsTimestamp) as Task;
    return await findTaskById(updatedTask.id);
  } catch (error) {
    console.error('[UPDATE_TASK] Error:', error);
    throw error;
  }
};

export const updateTaskImportantById = async ({ id, isImportant }: { id: number, isImportant: boolean }) => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);
    return await tasksDB.update(id, { isImportant: booleanToNumber(isImportant) }) as Task;
  } catch (error) {
    console.error('[UPDATE_TASK_IMPORTANT] Error:', error);
    throw error;
  }
};
export const updateSubtaskImportantById = async ({ id, isImportant }: { id: number, isImportant: boolean }) => {
  try {
    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
    return await subtasksDB.update(id, { isImportant: booleanToNumber(isImportant) }, subtaskIsTimestamp) as Subtask;
  } catch (error) {
    console.error('[UPDATE_SUBTASK_IMPORTANT] Error:', error);
    throw error;
  }
};

export const updateTaskIsCompletedById = async ({ id, isCompleted }: { id: number, isCompleted: boolean }) => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);
    return await tasksDB.update(id, { isCompleted: booleanToNumber(isCompleted) }) as Task;
  } catch (error) {
    console.error('[UPDATE_TASK_COMPLETED] Error:', error);
    throw error;
  }
};

export const updateSubtaskCompletedById = async ({ id, isCompleted }: { id: number, isCompleted: boolean }) => {
  try {
    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
    return await subtasksDB.update(id, { isCompleted: booleanToNumber(isCompleted) }, subtaskIsTimestamp) as Subtask;
  } catch (error) {
    console.error('[UPDATE_SUBTASK_COMPLETED] Error:', error);
    throw error;
  }
};


export const deleteTask = async (id: number) => {
  try {
    const tasksDB = await initializeTableFunctions(TASKS_TABLE);
    return await tasksDB.deleteOne([
      { field: 'id', value: id, operator: '=' }
    ]) as Task;
  } catch (error) {
    console.error('[DELETE_TASK] Error:', error);
    throw error;
  }
};

export const deleteSubtask = async (id: number) => {
  try {
    const subtasksDB = await initializeTableFunctions(SUBTASKS_TABLE);
    return await subtasksDB.deleteOne([
      { field: 'id', value: id, operator: '=' }
    ]) as Subtask;
  } catch (error) {
    console.error('[DELETE_SUBTASK] Error:', error);
    throw error;
  }
};