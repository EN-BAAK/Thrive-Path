import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDatabase = async () => {
  return SQLite.openDatabase({ name: 'thrivePath.db', location: 'default' });
};
