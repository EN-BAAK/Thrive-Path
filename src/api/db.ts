import { open, QuickSQLiteConnection } from 'react-native-quick-sqlite';

let databaseInstance: QuickSQLiteConnection | null = null;

export const getDatabase = async () => {
  if (databaseInstance) return databaseInstance;

  databaseInstance = open({
    name: 'thrivePath.db',
    location: "default"
  });

  await databaseInstance.executeAsync(`PRAGMA foreign_keys = ON;`);

  return databaseInstance;
};
