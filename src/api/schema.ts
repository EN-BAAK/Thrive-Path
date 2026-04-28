import { getDatabase } from './db';

export const initializeDatabase = async () => {
  const db = await getDatabase();

  // await db.executeAsync(`DROP INDEX IF EXISTS idx_goals_name;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_goals_priority;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_categories_name;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_tasks_title;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_subtasks_title;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_challenges_title;`);
  // await db.executeAsync(`DROP INDEX IF EXISTS idx_timer_logs_type;`);

  // await db.executeAsync(`DROP TABLE IF EXISTS goals;`);
  // await db.executeAsync(`DROP TABLE IF EXISTS tasks;`);
  // await db.executeAsync(`DROP TABLE IF EXISTS subtasks;`);
  // await db.executeAsync(`DROP TABLE IF EXISTS categories;`);
  // await db.executeAsync(`DROP TABLE IF EXISTS challenges;`);
  // await db.executeAsync(`DROP TABLE IF EXISTS timer_logs;`);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      icon TEXT
    );
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      isImportant INTEGER DEFAULT 0,
      status TEXT DEFAULT 'PENDING',
      priority INTEGER DEFAULT 2,
      categoryId INTEGER,
      deadline TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      UNIQUE(name),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      isCompleted INTEGER DEFAULT 0,
      isImportant INTEGER DEFAULT 0,
      categoryId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      isCompleted INTEGER DEFAULT 0,
      isImportant INTEGER DEFAULT 0,
      parentTaskId INTEGER NOT NULL,
      FOREIGN KEY (parentTaskId) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);

  await db.executeAsync(`
  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    targetValue INTEGER,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    maxHearts INTEGER DEFAULT 0,
    currentHearts INTEGER DEFAULT 0,
    maxStars INTEGER DEFAULT 0,
    currentStars INTEGER DEFAULT 0,
    isCompleted INTEGER DEFAULT 0,
    categoryId INTEGER,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
  );
`);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS timer_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      duration TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT
    );
  `);

  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_goals_name ON goals(name);`);
  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);`);

  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);`);

  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);`);
  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_subtasks_title ON subtasks(title);`);

  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_challenges_title ON challenges(title);`);

  await db.executeAsync(`CREATE INDEX IF NOT EXISTS idx_timer_logs_type ON timer_logs(type);`);

  return db;
};
