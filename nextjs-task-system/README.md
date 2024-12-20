# Task Management System - Technical Challenge

This project is a Task Management System designed to help users efficiently create, assign, and manage tasks. Built using Next.js, Tailwind CSS, and Flowbite, it provides a user-friendly interface for both Admin and Regular users.

## Project

**Main Technologies:**

- Next.js 14
- Flowbite React
- Tailwind CSS
- Zustand for global state management

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

8. **Form Validation**

   - Integrated form validation for login, task creation, and task editing, ensuring data integrity and user feedback on errors.

9. **Route Protection and Authentication Middleware**
   - Implemented middleware to protect routes and handle user authentication, ensuring that only authenticated users can access certain pages and that users are redirected appropriately based on their authentication status and roles.

### Technical Overview

#### Frontend

- **Framework**: React with TypeScript.
- **State Management**: Zustand, with a centralized store (`tasksStore`) for managing tasks, loading states, errors, authenticated users, registered users, and notifications.
- **Components**:
  - **Navbar**: Responsive navigation with theme switching, user information display, and logout functionality.
  - **TaskCard**: Displays key task details, including title, priority, due date, and assignee.
  - **TaskList**: Organizes tasks by status (Pending, In Progress, Completed).
  - **TaskForm**: Reusable form for task creation and editing, with integrated validation.
  - **CommentsSection**: Allows users to view and add comments to tasks.
  - **TaskDetails**: Combines task details and comments section for comprehensive task management.
  - **Toast**: Displays success and error notifications.
  - **LoginForm**: Handles user authentication with validation.
- **Pages**:
  - **Dashboard**: Displays tasks categorized by state, with filtering and sorting options.
  - **Login**: Redirects users to the dashboard upon successful login.
  - **CreateTaskPage**: Includes the validated task creation form.
  - **TaskDetailsPage**: Displays task details and allows editing and commenting.
- **Styling**: Tailwind CSS ensures a modern, responsive design adaptable to various devices.

#### Backend

- **API Routes**: Implemented using Next.js for CRUD operations and authentication:
  - **GET /api/tasks**: Fetch all tasks.
  - **GET /api/tasks/[id]**: Fetch a task by ID.
  - **POST /api/tasks**: Create a new task with validation.
  - **PUT /api/tasks/:id**: Update an existing task with validation.
  - **DELETE /api/tasks/:id**: Delete a task by ID.
  - **GET /api/users**: Fetch all users.
  - **POST /api/auth**: Handle user authentication.
- **Middleware**: Used for route protection and user authentication, ensuring secure access to sensitive routes based on user roles and authentication status.
- **Handlers and Adapters**: Used to encapsulate logic and normalize responses, ensuring reusability and maintainability.

#### Utilities

- **Helper Functions**: For making API requests with error handling and dynamic parameters.
- **Error Management**: Utilities for validating data and handling exceptions in tasks and users.
- **Validation**: Robust logic to ensure data integrity in forms and API requests.
- **Cookie Management**: Utility functions for handling cookies, including setting, getting, and removing cookie values to manage user authentication state across sessions.
- **Task Utilities**: Contains functions for filtering and sorting tasks, as well as managing task-related data.

#### Testing

- **Unit Tests**: Simple unit tests for API routes to ensure correct data handling and response.
- **UI Tests**: Basic UI tests for task viewing and management, verifying that components render correctly and user interactions work as expected.

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

````

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

## Running Tests

This project uses Jest for testing both the UI and API components. Below are the available scripts to run the tests:

### Run All Tests

To run both UI and API tests, use the following command:

```bash
npm test
```

### Run UI Tests

To run only the UI tests, use the following command:

```bash
npm run test:ui
```

### Run API Tests

To run only the API tests, use the following command:

```bash
npm run test:api
```

## Next Steps

- **SQLite Database**: Integrate SQLite as the database for persistent task storage.
- **Real-Time Updates**: Add functionality for real-time updates using WebSockets to notify users when new tasks are assigned.
- **Drag-and-Drop Task Management**: Implement a feature that allows users to change task status using drag-and-drop functionality.

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

**Note**: This is a completed technical challenge. Contributions are closed.

````
