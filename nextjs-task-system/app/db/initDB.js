import db from './database.js';
const initDB = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      pass TEXT NOT NULL,
      rol TEXT CHECK (rol IN ('admin', 'regular')) NOT NULL DEFAULT 'regular'
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS group_users (
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES groups(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to INTEGER,
      due_date TEXT,
      priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'low',
      status TEXT CHECK (status IN ('pending', 'in_progress', 'complete')) NOT NULL DEFAULT 'pending',
      comments TEXT,
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    )
  `).run();

  console.log('Base de datos inicializada.');
};

initDB(); 
