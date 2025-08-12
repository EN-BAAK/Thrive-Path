import { getDatabase } from './db';

export const initializeDatabase = async () => {
  const db = await getDatabase();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      icon TEXT
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      isImportant INTEGER DEFAULT 0,
      status TEXT DEFAULT 'PENDING',
      priority INTEGER DEFAULT 2,
      categoryId INTEGER,
      points INTEGER DEFAULT 0,
      deadline TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      UNIQUE(name),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_categoryId ON goals(categoryId);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);`);

  return db;
};
