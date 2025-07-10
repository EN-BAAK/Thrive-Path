// src/api/schema.ts
import { getDatabase } from './db';

export const initializeDatabase = async () => {
  const db = await getDatabase();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      flag INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      deadline TEXT,
      UNIQUE(name)
    );
  `);

  await db.executeSql(`
    CREATE INDEX IF NOT EXISTS idx_goals_name ON goals(name);
  `);

  return db;
};
