import { getDatabase } from '../db';
import initializeTableFunctions from '../../misc/database';
import { initializeDatabase } from '../schema';
import { booleanToNumber } from '../../misc/helpers';
import { Challenge, SafeChallenge } from '../../types/schemas';

initializeDatabase();

const TABLE_NAME = 'challenges';
const isTimestamp = true;

export const createChallenge = async (challenge: SafeChallenge) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.insert(challenge, isTimestamp);
  } catch (error) {
    console.error('[CREATE_CHALLENGE] Error:', error);
    throw error;
  }
};

export const findAllChallenges = async (): Promise<Challenge[]> => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.findAll<Challenge>(
      [],
      'challenges.createdAt DESC',
      [],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'points', alias: 'points' },
        { column: 'penaltyPoints', alias: 'penaltyPoints' },
        { column: 'targetValue', alias: 'targetValue' },
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
    console.error('[FIND_ALL_CHALLENGES] Error:', error);
    throw error;
  }
};

export const findChallengeById = async (id: number): Promise<Challenge | null> => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.findOne<Challenge>(
      [{ field: 'id', value: id }],
      [],
      [
        { column: 'id', alias: 'id' },
        { column: 'title', alias: 'title' },
        { column: 'description', alias: 'description' },
        { column: 'points', alias: 'points' },
        { column: 'penaltyPoints', alias: 'penaltyPoints' },
        { column: 'targetValue', alias: 'targetValue' },
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

export const updateChallenge = async (id: number, updates: Partial<Challenge>) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.update(id, updates, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CHALLENGE] Error:', error);
    throw error;
  }
};

export const deleteChallenge = async (id: number) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.deleteById(id);
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
    return await updateChallenge(id, { currentHearts: newHearts });
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
    return await updateChallenge(id, { currentStars: newStars });
  } catch (error) {
    console.error('[ADD_STAR] Error:', error);
    throw error;
  }
};

export const updateChallengeCompletedById = async (id: number, isCompleted: boolean) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.update(id, { isCompleted: booleanToNumber(isCompleted) }, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CHALLENGE_COMPLETED] Error:', error);
    throw error;
  }
};