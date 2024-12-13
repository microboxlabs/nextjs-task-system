Here is the README in English:

# Task Management System - Technical Challenge

## Project

**Main Technologies:**

- Next.js 14
- Flowbite React
- Tailwind CSS

## Project Status

### Day 1: Initial Setup

🔧 **Configuration**

- Development environment configured
- Dependencies installed
- Application running at `http://localhost:3000`

🛡️ **Security**

- Next.js updated to v14.2.20
- Critical vulnerabilities resolved:
  - Cache Poisoning
  - Denial of Service

📊 **Data Structure**

- Initial implementation with JSON
- Preparation for future migration to SQLite

### Day 2: API Routes Implementation

🛠️ **Backend**

- Implemented API Routes for task management:
  - **GET /api/tasks**: Fetch all tasks.
  - **POST /api/tasks**: Create a new task.
  - **PUT /api/tasks/:id**: Update an existing task.
  - **DELETE /api/tasks/:id**: Delete a task.
- Introduced reusable **handlers** and **adapters** for API logic.
- Developed utility functions for API interactions.

### Day 3: State Management and Frontend Components

🌀 **State Management**

- Integrated Zustand store for global state management.
- Store handles tasks, loading states, and errors.

🎨 **Frontend Components**

- Implemented the following components:
  - **TaskCard**: Displays individual task details.
  - **TaskList**: Groups tasks by status.
  - **Navbar**: Responsive navigation bar with theme toggle and user menu.
- Completed the **Dashboard** screen:
  - Displays tasks organized by status (Pending, In Progress, Completed).
  - Fully integrated with the Zustand store.

### Day 4: Task Creation and Management

📝 **Task Creation**

- Completed the form for creating tasks (Admin):
  - Captures title, description, assignment, due date, and priority.
  - Connected the form to the API route `/api/tasks` to save new tasks.

🛠️ **Task Management**

- Created the component for the comments section.
- Added the delete button to the task form.

### Day 5: Task Details Page Integration

🔗 **Task Details Page**

- Integrated components into the task details page accessible at `http://localhost:3000/tasks/[id]`.
- Users can view, update (information or add comments), or delete tasks.
- Integrated with API routes for PUT and DELETE at `http://localhost:3000/api/tasks/[id]`.

---

## Collaborators

- @korutx
- @odtorres

---

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/Jonlle/nextjs-task-system
cd nextjs-task-system/nextjs-task-system

# Install dependencies
npm install

# Run in development
npm run dev
```

---

## Next Steps

### **Implementación de Roles y Autorización**

1. **Definir Roles:**

   - Añadir un campo `role` al usuario (Admin o Regular).
   - Simular la autenticación añadiendo datos de usuario a un archivo `users.json`.

2. **Autorización en la UI:**

   - Mostrar opciones de administración (crear, editar, eliminar) solo a usuarios Admin.

3. **Autorización en las API Routes:**
   - Validar el rol del usuario en las rutas API.

---

## License

This project is licensed under the terms of the [MIT License](./LICENSE).

**Note**: This is a work-in-progress technical challenge. Contributions are closed.
