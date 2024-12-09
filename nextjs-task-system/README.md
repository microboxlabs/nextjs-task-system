# Task Management System
## Description
This project is a task management system designed for administrators and regular users. Administrators have advanced access to manage all tasks, while regular users can only view and manage their assigned tasks. The system leverages a modern tech stack to ensure scalability, responsiveness, and ease of use.

## Features
### Administrator
View all tasks.
Filter tasks by status and priority.
Create new tasks.
Edit existing tasks.
Delete tasks.
Manage comments related to tasks.
### Regular User
View their assigned tasks.
Create new tasks (if enabled).
Edit their own tasks.
View comments related to their tasks.
General
Role-based authentication system (ADMIN and REGULAR).
Responsive and user-friendly interface.
Real-time validations on both frontend and backend.
RESTful API for task and comment management.

## Technologies Used
Frontend
React.js
Next.js
Tailwind CSS
Zustand (State management)
Flowbite (UI components)
Backend
Next.js API Routes
Prisma ORM
SQLite (Database)
Authentication
JSON Web Tokens (JWT)

## Prerequisites
Ensure the following tools are installed on your system:

Node.js (v16 or higher)
npm or yarn
Git
Setup Instructions
1. Clone the Repository
$ git clone https://github.com/diegocabre/nextjs-task-system
cd nextjs-task-system

2. Install Dependencies
$ npm install

3. Setup Prisma and the Database
Prisma Schema
The database schema is managed using Prisma. The schema used in this project is as follows:
```generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./tms.db"
}

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String
  role        String   @default("REGULAR") // "ADMIN" or "REGULAR"
  group       Group?   @relation(fields: [groupId], references: [id])
  groupId     Int?
  tasks       Task[]
  comments    Comment[]
}

model Group {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  users       User[]
  tasks       Task[]
}

model Task {
  id           Int       @id @default(autoincrement())
  title        String    
  description  String    
  priority     String    @default("MEDIUM") // "LOW", "MEDIUM", "HIGH"
  dueDate      DateTime
  status       String    @default("PENDING") // "PENDING", "IN_PROGRESS", "COMPLETED"
  comments     Comment[]
  user         User?     @relation(fields: [userId], references: [id])
  userId       Int?
  group        Group?    @relation(fields: [groupId], references: [id])
  groupId      Int?
}

model Comment {
  id          Int      @id @default(autoincrement())
  content     String   
  task        Task     @relation(fields: [taskId], references: [id])
  taskId      Int
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}
```
4. Run Migrations
Run the following command to set up the database schema:
$ npx prisma migrate dev --name init

5. Seed Data
Use the provided seed script to populate your database with initial data:
$ node --loader ts-node/esm --experimental-specifier-resolution=node prisma/seed.ts


6. Environment Variables
Create a .env file in the root of your project and add the following:
DATABASE_URL="file:./tms.db" # SQLite
JWT_SECRET="your-secret-key"

7. Run the Development Server
npm run dev


User and Password

```
      email: "admin@example.com",
      password: hashedAdminPassword,
      role: "ADMIN",

```
```
      email: "regular@example.com",
      password: hashedRegularPassword,
      role: "REGULAR",
      groupId: group1.id,
```

```
      email: "regular2@example.com",
      password: hashedRegularPassword,
      role: "REGULAR",
      groupId: group2.id,
```

