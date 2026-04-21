import { initializeDatabase } from '../schema';
import { TimerLog, SafeTimerLog } from '../../types/schemas';
import { initializeTableFunctions } from '../../misc/database';

initializeDatabase();

const TIMER_LOGS_TABLE = 'timer_logs';
const timerLogIsTimestamp = false;

export const createTimerLog = async (log: Omit<SafeTimerLog, 'description'>) => {
  try {
    const timerLogsDB = await initializeTableFunctions(TIMER_LOGS_TABLE);
    return await timerLogsDB.insert(log, timerLogIsTimestamp);
  } catch (error) {
    console.error('[CREATE_TIMER_LOG] Error:', error);
    throw error;
  }
};

export const getAllTimerLogsByType = async (type: string): Promise<TimerLog[]> => {
  try {
    const timerLogsDB = await initializeTableFunctions(TIMER_LOGS_TABLE);
    return await timerLogsDB.findAll<TimerLog>(
      [{ field: 'type', value: type }],
      'timer_logs.id DESC'
    );
  } catch (error) {
    console.error('[GET_ALL_TIMER_LOGS_BY_TYPE] Error:', error);
    throw error;
  }
};

export const updateTimerLogDescription = async (id: number, description: string) => {
  try {
    const timerLogsDB = await initializeTableFunctions(TIMER_LOGS_TABLE);
    return await timerLogsDB.update(id, { description }, timerLogIsTimestamp);
  } catch (error) {
    console.error('[UPDATE_TIMER_LOG_DESCRIPTION] Error:', error);
    throw error;
  }
};

export const deleteTimerLogById = async (id: number) => {
  try {
    const timerLogsDB = await initializeTableFunctions(TIMER_LOGS_TABLE);
    return await timerLogsDB.deleteOne([
      { field: "id", value: id, operator: "=" }
    ]);
  } catch (error) {
    console.error('[DELETE_TIMER_LOG] Error:', error);
    throw error;
  }
};
