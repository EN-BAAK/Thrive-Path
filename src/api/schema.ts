import { getDatabase } from './db';

export const initializeDatabase = async () => {
  const db = await getDatabase();

  // await db.executeSql(`DROP INDEX IF EXISTS idx_goals_title;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_goals_priority;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_categories_name;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_tasks_title;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_subtasks_title;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_habits_title;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_challenges_title;`);
  // await db.executeSql(`DROP INDEX IF EXISTS idx_timer_logs_type;`);

  // await db.executeSql(`DROP TABLE IF EXISTS goals;`);
  // await db.executeSql(`DROP TABLE IF EXISTS tasks;`);
  // await db.executeSql(`DROP TABLE IF EXISTS subtasks;`);
  // await db.executeSql(`DROP TABLE IF EXISTS categories;`);
  // await db.executeSql(`DROP TABLE IF EXISTS habits;`);
  // await db.executeSql(`DROP TABLE IF EXISTS challenges;`);
  // await db.executeSql(`DROP TABLE IF EXISTS timer_logs;`);

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

  await db.executeSql(`
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    habitType TEXT DEFAULT 'GOOD' NOT NULL,
    winPoints INTEGER DEFAULT 0,
    losePoints INTEGER DEFAULT 0,
    repeatInterval TEXT DEFAULT 'DAILY',
    customIntervalDays INTEGER,
    repeatWeekDay INTEGER,
    repeatMonthDay INTEGER,
    deadline TEXT,
    categoryId INTEGER,
    goalId INTEGER,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE SET NULL
  );
`);

  await db.executeSql(`
  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    penaltyPoints INTEGER DEFAULT 0,
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

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS timer_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      duration TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      type TEXT NOT NULL,
      description TEXT
    );
  `);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_title ON goals(title);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_subtasks_title ON subtasks(title);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_habits_title ON habits(title);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_challenges_title ON challenges(title);`);

  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_timer_logs_type ON timer_logs(type);`);

  return db;
};
