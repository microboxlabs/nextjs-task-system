-- Drop existing tables and views if they exist
DROP VIEW IF EXISTS tasks_with_users;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  assigned_to INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in progress', 'completed')),
  comments TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create a view to join tasks with user information
CREATE VIEW IF NOT EXISTS tasks_with_users AS
SELECT 
  t.id,
  t.title,
  t.description,
  t.due_date,
  t.priority,
  t.status,
  t.comments,
  t.created_at,
  t.updated_at,
  t.user_id,
  u1.first_name || ' ' || u1.last_name as creator_name,
  t.assigned_to,
  u2.first_name || ' ' || u2.last_name as assignee_name
FROM tasks t
JOIN users u1 ON t.user_id = u1.id
JOIN users u2 ON t.assigned_to = u2.id;

-- Create indexes to optimize queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert initial data
INSERT INTO users (first_name, last_name, email, password, role) 
VALUES ('admin', 'admin', 'admin@example.com', 'securepassword', 'admin');

INSERT INTO users (first_name, last_name, email, password, role) 
VALUES ('user', 'user', 'user@example.com', 'securepassword', 'user');

update users set role = 'admin' where id = 2;