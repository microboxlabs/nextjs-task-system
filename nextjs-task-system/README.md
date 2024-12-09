### Solution Overview
This project is a task management system designed to efficiently organize and track tasks. It features a robust backend powered by Prisma ORM and a lightweight SQLite database for storage, ensuring smooth data management and retrieval. The solution utilizes **Next.js** as the framework, which enables server-side rendering and API route handling, ensuring high performance and responsiveness across the application.

### Key Architectural Components

- **Database**:
  - **Prisma ORM** is used for seamless interaction with the SQLite database, ensuring smooth data manipulation for tasks, users, and other related entities. It allows for efficient querying and transactions, ensuring data consistency and integrity.

- **Task Management**:
  - The core of the application revolves around task management. The backend exposes RESTful API routes (GET, POST, PUT, DELETE) for managing tasks. These routes allow users to create, update, fetch, and delete tasks, which can be assigned to different users and tracked by priority and status.

- **Authentication and Authorization**:
  - Authentication is handled using **NextAuth**, ensuring secure login and role-based access control. Admin users have full access to task management functionalities, while Regular users have limited access to tasks assigned to them.

- **Error Handling**:
  - Custom error handling is built in using the **errorHandler** class, ensuring consistent and user-friendly error messages across the application.

- **Testing**:
  - Unit tests are handled using **Jest**, ensuring that critical logic such as task management and API routes work correctly. This ensures the system is reliable and maintainable.

## Technologies Used

- **Next.js**: The main framework for server-side rendering and API route handling.
- **SQLite**: Lightweight relational database for storing tasks and user information.
- **NextAuth.js**: Authentication solution for secure login and role-based access.
- **Tailwind CSS**: Styling framework for the frontend.
- **Prisma ORM**: For managing and interacting with the SQLite database.
- **React Hook Form**: Library for handling forms in React.
- **Flowbite**: A UI kit for building responsive components.
- **Bcrypt**: For securely hashing passwords.
- **Jest**: Unit testing framework for ensuring the reliability of task management features.
- **Prettier**: Code formatting tool to maintain consistent coding style.

## Users for Testing

The project includes a functional login system with role-based access control. Use the following users to start testing the functionalities:

### 1. **Admin User**
- **Email**: admin@example.com
- **Password**: 123456
- **Permissions**:
  - Create, assign, edit, and delete tasks.
  - View all tasks, regardless of assigned user
  - Filter tasks by user, group, or status.

### 2. **Regular User**
- **Email**: johnmorrison@example.com
- **Password**: 123456
- **Permissions**:
  - View only tasks assigned to them.
  - Mark tasks assigned to them as complete.

## Prerequisites

- **Node.js**: You need to have Node.js installed on your system. 
- **SQLite**: This project uses SQLite as the database. Ensure you have the SQLite3 library available.
- **npm**: npm comes installed with Node.js, but make sure it's available to manage the project's dependencies.



This structure allows for scalable task management functionality, and as development progresses, new features such as task filtering, notifications, and analytics can be easily integrated into the existing infrastructure.
