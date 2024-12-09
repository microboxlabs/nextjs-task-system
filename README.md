### MicroboxLabs Fullstack Challenge: Task Management System
This technical test requires you to design and implement a **Task Management System** using **Next.js**, **Tailwind CSS**, and **Flowbite**. The system will help MicroboxLabs assign and manage tasks efficiently, with capabilities for assigning tasks to users or groups.

#### **Before You Begin**
Fork this repository and invite the provided collaborators: `@korutx`, `@odtorres`. Should you have any questions, contact `devtest@microboxlabs.com`.  

#### **Problem Description**
MicroboxLabs needs a simple task management solution to help organize internal work and track the progress of tasks assigned to employees. This system will be used by both Admins to manage tasks and by employees to view and update their assigned work.

The application will allow **Admin** users to create tasks and assign them to either individual users or groups, and **Regular** users to manage their assigned tasks.

#### **Guidelines**
- We provide a basic Flowbite + Next.js template to get you started.
- You can use any additional libraries you see fit, but make sure to justify your choices.
- Flowbite documentation is available [here](https://flowbite-react.com/docs/getting-started/introduction).
- Tailwind CSS documentation is available [here](https://tailwindcss.com/docs/utility-first).
- Next.js documentation is available [here](https://nextjs.org/docs).

#### **Core Requirements**
The goal is to create a web application where users can **create**, **assign**, **view**, and **update** tasks. The key features are as follows:

### **User Roles**
1. **Admin User**: 
   - Can create, assign, edit, and delete tasks.
   - Can view and manage all tasks.
2. **Regular User**: 
   - Can view tasks assigned to them or their group.
   - Can mark tasks as complete.

### **Features**
1. **Task Creation and Assignment (Admin Only)**
   - **Admin** users can create tasks with the following fields:
     - **Title**: The name of the task.
     - **Description**: Details of the task.
     - **Assigned To**: Either a specific **user** or a **group** of users.
     - **Due Date**: The date by which the task must be completed.
     - **Priority**: Low, Medium, High.
   - Tasks can be assigned to an individual user or a group (e.g., "Frontend Team").

2. **Viewing Tasks**
   - **Admin** users can view **all tasks**, filter by **user**, **group**, or **status** (e.g., completed, pending).
   - **Regular** users can only view tasks assigned to them or their group.

3. **Managing Tasks (Regular Users)**
   - Users can mark their assigned tasks as **complete**.
   - Users can add **comments** to a task for better communication (e.g., "Started working on this").

4. **Task Status Tracking**
   - Tasks can have statuses such as:
     - **Pending**: Task is newly created.
     - **In Progress**: Task is being worked on.
     - **Completed**: Task has been finished by the assignee.

5. **Filtering and Sorting Tasks**
   - Users can filter tasks by **status**, **priority**, or **assigned user/group**.
   - Admin users can also **sort tasks** by **due date**, **priority**, or **creation date**.

6. **Responsive User Interface**
   - Use **Tailwind CSS** and **Flowbite** components to create a simple and responsive UI.
   - The application should have:
     - A **navbar** to navigate between different sections.
     - A **dashboard** page for viewing and filtering tasks.
     - A **task creation page** for Admin users.

7. **Basic Authorization**
   - Admin users should be able to access the task creation and management pages, while regular users should only have access to the task list assigned to them.

8. **Database**
   - Use a lightweight database (e.g., SQLite) to store tasks.
   - Each task should be stored as a record in the database, with fields for **title**, **description**, **assigned to**, **due date**, **priority**, **status**, and **comments**.

### **Use Cases**
1. **Admin Creates and Assigns a Task**:
   - An **Admin** logs in and navigates to the **Create Task** page.
   - They fill in the task details, select a **user** or **group** to assign it to, and click **Create**.
   - The task is now assigned and visible to the appropriate users.

2. **Viewing Assigned Tasks**:
   - A **Regular User** logs in and navigates to the **Task Dashboard**.
   - They see a list of tasks assigned to them and their group, with details like **due date**, **priority**, and **status**.

3. **Marking a Task as Complete**:
   - A **Regular User** starts working on a task and marks it as **In Progress**.
   - Once finished, they mark the task as **Completed** and add a comment ("Finished and uploaded the required document").

#### **Technologies to Use**
- **Frontend**: Next.js, Tailwind CSS, Flowbite.
- **Backend**: Next.js API routes for handling task creation, assignment, and updates.
- **Database**: SQLite or an in-memory solution to store tasks.

#### **Aspects to Be Evaluated**
1. **Functionality**:
   - Does the solution meet all the core requirements?
   - Are users able to create, view, and manage tasks effectively?
2. **Software Design**: 
   - Logical organization of files, components, and API routes.
   - Clean separation between frontend and backend logic.
3. **Code Quality**:
   - Readable, maintainable code with clear comments.
   - Good use of modern JavaScript and TypeScript features.
4. **Testing**:
   - Simple unit tests for API routes.
   - Basic UI tests for task viewing and management.
5. **UI/UX**:
   - Effective use of **Tailwind CSS** and **Flowbite** to create a user-friendly, clean, and responsive interface.

#### **Aspects to Ignore**
- **Advanced Visual Design**: Focus on functionality rather than intricate visual styling.
- **Scalability and Performance Optimization**: The emphasis is on demonstrating core capabilities, not handling massive volumes of data.

#### **Optional Bonus Points**
- **Real-Time Updates**: Add functionality for real-time updates using Server-Sent Events (SSE) or WebSockets to notify users when new tasks are assigned.
- **Role-Based Authentication**: Implement simple role-based access control for Admin vs. Regular User capabilities.
- **Drag-and-Drop Task Management**: Implement a feature that allows users to change task status using drag-and-drop.

#### **Getting Started**
1. **Fork/Clone** the repository.
2. Set up the project using **Next.js**, **Tailwind CSS**, and **Flowbite**.
3. Implement the **Task Management System** scenario as described.
4. Use any tools or resources, including AI (e.g., ChatGPT or GitHub Copilot), to assist you.

This task is designed to test your ability to work on a small fullstack application, focusing on managing tasks, handling CRUD operations, and understanding user roles and permissions. We look forward to seeing your solution!

---

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


## Prerequisites

- **Node.js**: You need to have Node.js installed on your system. 
- **SQLite**: This project uses SQLite as the database. Ensure you have the SQLite3 library available.
- **npm**: npm comes installed with Node.js, but make sure it's available to manage the project's dependencies.



This structure allows for scalable task management functionality, and as development progresses, new features such as task filtering, notifications, and analytics can be easily integrated into the existing infrastructure.