# Steeps

## Install Dependencies
There might be some issues when installing Jest. To resolve them, use the following command:

```bash
npm install --force
```

## Prisma Migrations

1. **Run Development Migrations**  
   This will apply any pending migrations to your local database:
   
   ```bash
   npx prisma migrate dev
   ```

2. **Apply Migrations**  
   Apply migrations to the production database:

   ```bash
   npx prisma migrate deploy
   ```

## Run Seeds

To populate the database with initial data, use the following command:

```bash
npm run seed
```

## Run Tests

Execute the tests using Jest:

```bash
npx jest
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Core Features

###  Role-Based Authentication
- Admins and users can sign in in the application using their own credentials
### Role-Based Access Control:
- **Admin users** can create, assign, edit, and delete tasks.
- **Regular users** can view and update tasks assigned to them.

### Task Creation and Management:
- Tasks include fields for title, description, assignee to one or more (user or group), due date, and priority.
- Admins can filter tasks by: user or group, status, and priority.
- Admins can sort by: Creation Date, Due Date, Priority.
- Users can mark tasks as completed or other status and also apply some filters: status, priority and sort in the same way of admin.

### Comments Management:
- Admins and Users can add comments to the tasks.
- 
### Groups Management:
- Admins can create a group: selecting a group of users by name.

### Responsive Design:
- Built with **Next.js**, **Tailwind CSS**, and **Flowbite** to ensure a modern, clean, and user-friendly interface.

### Drag-and-Drop Task Management:
- Users can change task status through an intuitive drag-and-drop interface, improving workflow organization.

## Notes
- **Documentation**: Full details provided in the `README.md`, including how to use the system.

### Documentation
- Updated `README.md` with steps to run the project.

### Tests
- Added unit tests for routes: task and group.
