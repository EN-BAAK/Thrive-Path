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
        { column: 'goalPoints', alias: 'goalPoints' },
        { column: 'penaltyPoints', alias: 'penaltyPoints' },
        { column: 'targetValue', alias: 'targetValue' },
        { column: 'progressValue', alias: 'progressValue' },
        { column: 'startDate', alias: 'startDate' },
        { column: 'endDate', alias: 'endDate' },
        { column: 'linkedHabitId', alias: 'linkedHabitId' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'isActive', alias: 'isActive' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'goalId', alias: 'goalId' },
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
        { column: 'goalPoints', alias: 'goalPoints' },
        { column: 'penaltyPoints', alias: 'penaltyPoints' },
        { column: 'targetValue', alias: 'targetValue' },
        { column: 'progressValue', alias: 'progressValue' },
        { column: 'startDate', alias: 'startDate' },
        { column: 'endDate', alias: 'endDate' },
        { column: 'linkedHabitId', alias: 'linkedHabitId' },
        { column: 'isCompleted', alias: 'isCompleted' },
        { column: 'isActive', alias: 'isActive' },
        { column: 'categoryId', alias: 'categoryId' },
        { column: 'goalId', alias: 'goalId' },
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

// -------- Special updates --------
export const updateChallengeProgress = async (id: number, progressValue: number) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.update(id, { progressValue }, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CHALLENGE_PROGRESS] Error:', error);
    throw error;
  }
};

export const incrementChallengeProgress = async (id: number, amount: number = 1) => {
  try {
    const challenge = await findChallengeById(id);
    if (!challenge) throw new Error(`Challenge with id ${id} not found`);
    const newProgress = (challenge.progressValue || 0) + amount;
    return await updateChallengeProgress(id, newProgress);
  } catch (error) {
    console.error('[INCREMENT_CHALLENGE_PROGRESS] Error:', error);
    throw error;
  }
};

export const decrementChallengeProgress = async (id: number, amount: number = 1) => {
  try {
    const challenge = await findChallengeById(id);
    if (!challenge) throw new Error(`Challenge with id ${id} not found`);
    const newProgress = Math.max(0, (challenge.progressValue || 0) - amount);
    return await updateChallengeProgress(id, newProgress);
  } catch (error) {
    console.error('[DECREMENT_CHALLENGE_PROGRESS] Error:', error);
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

export const updateChallengeActiveById = async (id: number, isActive: boolean) => {
  try {
    const challengesDB = await initializeTableFunctions(getDatabase, TABLE_NAME);
    return await challengesDB.update(id, { isActive: booleanToNumber(isActive) }, isTimestamp);
  } catch (error) {
    console.error('[UPDATE_CHALLENGE_ACTIVE] Error:', error);
    throw error;
  }
};
