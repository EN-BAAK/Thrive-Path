import { getDatabase } from './db';

export const initializeDatabase = async () => {
  const db = await getDatabase();

  // await db.executeSql(`DROP TABLE IF EXISTS goals`)
  // await db.executeSql(`DROP TABLE IF EXISTS tasks`)
  // await db.executeSql(`DROP TABLE IF EXISTS subtasks`)
  // await db.executeSql(`DROP TABLE IF EXISTS categories`)

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

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      isCompleted INTEGER DEFAULT 0,
      isImportant INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      categoryId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      isCompleted INTEGER DEFAULT 0,
      isImportant INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      parentTaskId INTEGER NOT NULL,
      FOREIGN KEY (parentTaskId) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_subtasks_title ON subtasks(title);`);

  return db;
};
