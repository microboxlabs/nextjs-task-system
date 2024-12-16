# Task Management System - Technical Challenge

This project is a Task Management System designed to help users efficiently create, assign, and manage tasks. Built using Next.js, Tailwind CSS, and Flowbite, it provides a user-friendly interface for both Admin and Regular users.

## Project

**Main Technologies:**

- Next.js 14
- Flowbite React
- Tailwind CSS

## Features

### User Roles

1. **Admin User**:
   - Can create, assign, edit, and delete tasks.
   - Can view and manage all tasks.
2. **Regular User**:
   - Can view tasks assigned to them or their group.
   - Can mark tasks as Completed or In Progress.

### Core Functionalities

1. **Task Creation and Assignment (Admin Only)**

   - Admin users can create tasks with fields for title, description, assigned user/group, due date, and priority.
   - Tasks can be assigned to a specific user or a group.

2. **Viewing Tasks**

   - Admin users can view all tasks, filtering by user, group, or status (completed, pending).
   - Regular users can only view tasks assigned to them or their group.

3. **Managing Tasks (Regular Users)**

   - Users can mark their assigned tasks as complete.
   - Users can change the status of their tasks to In Progress.
   - Users can add comments to tasks for better communication.

4. **Task Status Tracking**

   - Tasks can have statuses such as Pending, In Progress, and Completed.

5. **Filtering and Sorting Tasks**

   - Users can filter tasks by status, priority, or assigned user/group.
   - Admin users can also sort tasks by due date, priority, or creation date.

6. **Responsive User Interface**

   - Utilizes Tailwind CSS and Flowbite to create a simple and responsive interface.
   - The application includes a navbar for navigation and a dashboard page for viewing and filtering tasks.

7. **Basic Authorization**
   - Admin users can access task creation and management pages, while regular users can only access their assigned task list.

## Collaborators

- @korutx
- @odtorres

## Quick Installation

To run the application, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Jonlle/nextjs-task-system
   cd nextjs-task-system/nextjs-task-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a file (e.g., `.env.local`) to define the necessary environment variables as shown in the following example:

   ```plaintext
   # .env.example
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Run in development:
   ```bash
   npm run dev
   ```

## Next Steps

- **Form Validation**: Implement validation for task creation and editing forms to ensure data integrity.
- **SQLite Database**: Integrate SQLite as the database for persistent task storage.
- **Real-Time Updates**: Add functionality for real-time updates using WebSockets to notify users when new tasks are assigned.
- **Drag-and-Drop Task Management**: Implement a feature that allows users to change task status using drag-and-drop functionality.

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

**Note**: This is a completed technical challenge. Contributions are closed.
