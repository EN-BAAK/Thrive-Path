import { initializeDatabase } from '../schema';
import { booleanToNumber } from '../../misc/helpers';
import { Challenge, SafeChallenge } from '../../types/schemas';
import { initializeTableFunctions } from '../../misc/database';
import { PaginatedResult, Pagination } from '../../types/variables';

initializeDatabase();

const TABLE_NAME = 'challenges';
const isTimestamp = true;

export const findAllChallenges = async ({ limit = 10, offsetUnit = 0, page = 1 }: Pagination): Promise<PaginatedResult<Challenge>> => {
  const safePage = Math.max(1, page);
  const offset = (limit * (safePage - 1)) + offsetUnit;

  const pagination = { limit, offset };

  try {
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    const { count, data } = await challengesDB.findAllWithCount<Challenge>(
      [],
      'challenges.createdAt DESC',
      [],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'startDate', alias: 'startDate' },
        { column: 'endDate', alias: 'endDate' },
        { column: 'maxHearts', alias: 'maxHearts' },
        { column: 'currentHearts', alias: 'currentHearts' },
        { column: 'maxStars', alias: 'maxStars' },
        { column: 'currentStars', alias: 'currentStars' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
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
    console.error('[FIND_ALL_CHALLENGES] Error:', error);
    throw error;
  }
};

export const findChallengeById = async (id: number): Promise<Challenge | null> => {
  try {
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    return await challengesDB.findOne<Challenge>(
      [{ field: 'id', value: id }],
      [],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'startDate', alias: 'startDate' },
        { column: 'endDate', alias: 'endDate' },
        { column: 'maxHearts', alias: 'maxHearts' },
        { column: 'currentHearts', alias: 'currentHearts' },
        { column: 'maxStars', alias: 'maxStars' },
        { column: 'currentStars', alias: 'currentStars' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'createdAt', alias: 'createdAt' },
        { column: 'updatedAt', alias: 'updatedAt' }
      ]
    );
  } catch (error) {
    console.error('[FIND_CHALLENGE_BY_ID] Error:', error);
    throw error;
  }
};

export const createChallenge = async (challenge: SafeChallenge) => {
  try {
    challenge.currentHearts = challenge.maxHearts || 0;
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    return await challengesDB.insert(challenge, isTimestamp) as Challenge;
  } catch (error) {
    console.error('[CREATE_CHALLENGE] Error:', error);
    throw error;
  }
};

export const updateChallenge = async ({ id, updates }: { id: number, updates: Partial<Challenge> }) => {
  try {
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    return await challengesDB.update(id, updates, isTimestamp) as Challenge;
  } catch (error) {
    console.error('[UPDATE_CHALLENGE] Error:', error);
    throw error;
  }
};

export const deleteChallenge = async (id: number) => {
  try {
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    return await challengesDB.deleteOne([
      { field: "id", value: id, operator: "=" }
    ]) as Challenge;
  } catch (error) {
    console.error('[DELETE_CHALLENGE] Error:', error);
    throw error;
  }
};

export const deleteHeart = async (id: number) => {
  try {
    const challenge = await findChallengeById(id);
    if (!challenge) throw new Error(`Challenge with id ${id} not found`);
    const newHearts = Math.max(0, (challenge.currentHearts || 0) - 1);
    return await updateChallenge({ id, updates: { currentHearts: newHearts } }) as Challenge;
  } catch (error) {
    console.error('[DELETE_HEART] Error:', error);
    throw error;
  }
};

export const addStar = async (id: number) => {
  try {
    const challenge = await findChallengeById(id);
    if (!challenge) throw new Error(`Challenge with id ${id} not found`);
    const newStars = Math.min(challenge.maxStars || 0, (challenge.currentStars || 0) + 1);
    return await updateChallenge({ id, updates: { currentStars: newStars } });
  } catch (error) {
    console.error('[ADD_STAR] Error:', error);
    throw error;
  }
};

export const updateChallengeCompletedById = async (id: number, isCompleted: boolean) => {
  try {
    const challengesDB = await initializeTableFunctions(TABLE_NAME);
    return await challengesDB.update(id, { isCompleted: booleanToNumber(isCompleted) }, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CHALLENGE_COMPLETED] Error:', error);
    throw error;
  }
};