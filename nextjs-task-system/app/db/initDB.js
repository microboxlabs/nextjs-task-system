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
      assigned_to TEXT,
      assigned_to_id INTEGER,
      assigned_to_type TEXT CHECK (assigned_to_type IN ('user', 'group')) NOT NULL DEFAULT 'user',
      due_date TEXT,
      priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'low',
      status TEXT CHECK (status IN ('pending', 'in progress', 'completed')) NOT NULL DEFAULT 'pending',
      FOREIGN KEY (assigned_to_id) REFERENCES users(id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();

  console.log('Base de datos inicializada.');

  db.prepare(`INSERT OR IGNORE INTO users (username, email, pass, rol) VALUES 
      ('admin', 'admin@gmail.com', '$2b$10$Z8Afr6d8xz.sisU.vRmLh.UwMNz9XyuWJRvxDyRjS.DeXu1dCzO3.', 'admin'), -- admin123
      ('front', 'front@gmail.com', '$2b$10$S8p5tUvVmXQdRfhTxF./lubaTz1l8HpVssARBEgZmnyb7iPiGw9Q2', 'regular'), -- front123
      ('back', 'back@gmail.com', '$2b$10$h2TuFLBs8IAJ5hDMWQYbfOza/p8FY0tRuqU0alZhqtrFsxirsI2yi', 'regular'), -- back123
      ('QA', 'QA@gmail.com', '$2b$10$d5TMXFf24u40FuOXpD7hBu4qzlnSr6X4rbOcbAud4JwBQT8UEekhy', 'regular'); -- qa123
  `).run();

  db.prepare(`INSERT OR IGNORE INTO groups (name) VALUES 
    ('Development Team'),
    ('FrontEnd Team'),
    ('BackEnd Team'),
    ('QA Team')
  `).run();

  db.prepare(`INSERT OR IGNORE INTO group_users (group_id, user_id) VALUES 
    (1, 2), -- front en Development Team
    (2, 2), -- front en FrontEnd Team
    (1, 3), -- back en Development Team
    (3, 3), -- back en BackEnd Team
    (4, 4)  -- QA en QA Team

  `).run();

  db.prepare(`INSERT OR IGNORE INTO tasks (title, description,assigned_to,assigned_to_id,assigned_to_type, due_date, priority, status) VALUES 
    ('Implementar navbar responsive', 'Crear un navbar que se adapte a diferentes dispositivos','front', 2,'user', '2024-09-01', 'high', 'in progress'),
    ('Optimizar la API de usuarios', 'Mejorar los tiempos de respuesta de la API de usuarios','back', 3,'user', '2024-09-10', 'medium', 'pending'),
    ('Testear funcionalidades de la aplicación', 'Realizar pruebas de regresión en la app', 'QA Team', 4, 'group', '2024-09-15', 'high', 'pending'),
    ('Crear landing page', 'Desarrollar una landing page para el nuevo producto', 'FrontEnd Team', 2, 'group', '2024-09-05', 'high', 'in progress'),
    ('Refactorizar endpoints obsoletos', 'Eliminar y actualizar endpoints que ya no se utilizan', 'BackEnd Team', 3, 'group', '2024-09-20', 'low', 'pending'),
    ('Planeamiento del Sprint 5', 'Definir las tareas y objetivos del próximo sprint del proyecto', 'Development Team', 1, 'group', '2024-09-01', 'high', 'pending')

  `).run();


  db.prepare(`INSERT OR IGNORE INTO comments (task_id, user_id, comment) VALUES 
    (1, 2, 'Ya empecé a trabajar en el diseño del navbar.'),
    (1, 4, 'Asegúrate de probarlo en dispositivos pequeños.'),
    (2, 3, 'Estoy analizando los cuellos de botella en la API.'),
    (3, 4, 'Voy a empezar las pruebas de regresión mañana.'),
    (4, 2, 'La estructura inicial de la landing page está lista.'),
    (5, 3, 'Empezaré a revisar los endpoints esta semana.')
  `).run();

  console.log('Datos iniciales insertados.');
};

initDB(); 
