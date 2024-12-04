import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("./task-manager.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Crear tablas si no existen
export const initializeDB = () => {
  db.serialize(() => {
    db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `);

    db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                assigned_to INTEGER,
                due_date TEXT,
                priority TEXT,
                status TEXT DEFAULT 'Pending',
                comments TEXT,
                FOREIGN KEY (assigned_to) REFERENCES users (id)
            )
        `);

    db.run(`
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            ) 
        `);

    db.run(`
            CREATE TABLE IF NOT EXISTS user_groups (
                user_id INTEGER,
                group_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (group_id) REFERENCES groups (id),
                PRIMARY KEY (user_id, group_id)
);

          `);
  });
};
