CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

insert into users (first_name, last_name, email, password, role) values ('admin', 'admin', 'brz@mail.com', '12345678', 'admin');

insert into users (first_name, last_name, email, password, role) values ('user', 'user', 'bry@mail.com', '123456', 'user');

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to INTEGER NOT NULL, 
  due_date TEXT NOT NULL, 
  priority TEXT NOT NULL, 
  status TEXT NOT NULL, 
  comments TEXT, 
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (assigned_to) REFERENCES users (id)
);

drop table if exists tasks;

select tasks.id, title, description,
 users.first_name ||' '|| users.last_name,
  due_date, priority, status,
 comments, created_at,
  updated_at 
  from tasks 
  join users on tasks.assigned_to = users.id;