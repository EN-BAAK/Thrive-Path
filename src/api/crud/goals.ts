import { Goal, GoalWCategory, SafetyGoal } from '../../types/schemas';
import { initializeDatabase } from '../schema';
import { Condition, IdentifyEntity, PaginatedResult, Pagination, Status } from '../../types/variables';
import { booleanToNumber } from '../../misc/helpers';
import { initializeTableFunctions } from '../../misc/database';

initializeDatabase();

const TABLE_NAME = 'goals';
const isTimestamp = true;

export const findAllGoals = async ({ limit = 10, offsetUnit = 0, page = 1 }: Pagination): Promise<PaginatedResult<GoalWCategory>> => {
  const safePage = Math.max(1, page);
  const offset = (limit * (safePage - 1)) + offsetUnit;

  const pagination = { limit, offset };

  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);

    const { count, data } = await goalsDB.findAllWithCount<GoalWCategory>(
      [],
      'createdAt DESC',
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
        { column: 'deadline', alias: "deadline" },
        { column: 'status', alias: "status" },
        { column: 'priority', alias: "priority" },
        { column: 'categoryId', alias: "categoryId" },
        { column: 'createdAt', alias: "createdAt" },
        { column: 'updatedAt', alias: "updatedAt" }
      ],
      pagination
    );

    const totalPages = Math.ceil(count / limit);
    const hasMore = safePage < totalPages;
    const hasPrevious = safePage > 1;

    return {
      data,
      count,
      limit,
      page,
      totalPages,
      hasMore,
      hasPrevious,
      nextPage: hasMore ? safePage + 1 : null,
      prevPage: hasPrevious ? safePage - 1 : null,
    };
  } catch (error) {
    console.error('[GET_GOALS] Error:', error);
    throw error;
  }
};

export const findGoalIdentities = async (): Promise<IdentifyEntity[]> => {
  const goalsDB = await initializeTableFunctions(TABLE_NAME);
  return await goalsDB.findAll<IdentifyEntity>(
    [],
    "goals.createdAt DESC",
    [],
    [
      { column: "id", alias: "id" },
      { column: "name", alias: "name" }
    ]
  )
}

export const findGoalById = async (id: number): Promise<GoalWCategory | null> => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
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
        { column: 'id', alias: 'id' },
        { column: 'name', alias: 'name' },
        { column: 'description', alias: 'description' },
        { column: 'isImportant', alias: 'isImportant' },
        { column: 'deadline', alias: 'deadline' },
        { column: 'status', alias: 'status' },
        { column: 'priority', alias: 'priority' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );
  } catch (error) {
    console.error('[FIND_GOAL_BY_ID] Error:', error);
    throw error;
  }
};

export const findGoal = async (conditions: Condition[]): Promise<Goal | null> => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    return await goalsDB.findOne<Goal>(conditions);
  } catch (error) {
    console.error('[FIND_GOAL] Error:', error);
    throw error;
  }
};

export const createGoal = async (goal: SafetyGoal) => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    const createdGoal = await goalsDB.insert(goal, isTimestamp) as Goal;
    return await findGoalById(createdGoal.id);
  } catch (error) {
    console.error('[CREATE_GOAL] Error:', error);
    throw error;
  }
};


export const updateGoal = async ({ id, updates }: { id: number, updates: Partial<Goal> }) => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    await goalsDB.update(id, updates, isTimestamp);
    return await findGoalById(id)
  } catch (error) {
    console.error('[UPDATE_GOAL] Error:', error);
    throw error;
  }
};

export const updateIsImportantById = async ({ id, isImportant }: { id: number, isImportant: boolean }) => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    return await goalsDB.update(id, { isImportant: booleanToNumber(isImportant) }) as Goal;
  } catch (error) {
    console.error('[UPDATE_IS_IMPORTANT] Error:', error);
    throw error;
  }
};

export const updateGoalStatusById = async ({ id, status }: { id: number, status: Status }) => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    return await goalsDB.update(id, { status }) as Goal;
  } catch (error) {
    console.error('[UPDATE_STATUS] Error:', error);
    throw error;
  }
};

export const deleteGoal = async (id: number) => {
  try {
    const goalsDB = await initializeTableFunctions(TABLE_NAME);
    return await goalsDB.deleteOne([
      { field: "id", operator: "=", value: id }
    ]) as Goal;
  } catch (error) {
    console.error('[DELETE_GOAL] Error:', error);
    throw error;
  }
};
