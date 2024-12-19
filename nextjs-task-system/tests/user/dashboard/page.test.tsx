import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Dashboard from '@/app/user/dashboard/page';
import * as TaskHook from '@/hooks/useUserTask';
import { PriorityType, StatusType } from '@/types/task';

describe('User Dashboard', () => {

  it('should render user tasks correctly', async () => {
    // Simula el hook useTask para devolver algunas tareas y el estado de carga
    const mockTasks = [
      { id: 1, title: 'Task 1', description: "", dueDate: '2024-12-17', priority: 'High' as PriorityType, status: 'Pending' as StatusType, assignedTo: 'Test User', idAssignedTo: 1, creationDate: '2024-11-01', comments: "" },
      { id: 2, title: 'Task 2', description: "", dueDate: '2024-12-18T03:00:00.000Z', priority: 'High' as PriorityType, status: 'Pending' as StatusType, assignedTo: 'Test User', idAssignedTo: 1, creationDate: '2024-11-01', comments: "" },
    ];

    // Configurar el mock del hook
    const useUserTaskSpy = vi.spyOn(TaskHook, 'useUserTask').mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      handleUpdateTask: vi.fn(),
      handleSortChange: vi.fn()
    });

    // Renderiza el componente Dashboard
    render(<Dashboard />);

    // Verifica que las tareas están renderizadas
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeTruthy();
      expect(screen.getByText('Task 2')).toBeTruthy();
    });

    useUserTaskSpy.mockRestore();
  });

  it('should show loading spinner when tasks are loading', () => {
    // Simula el hook useTask con loading true
    const useUserTaskSpy = vi.spyOn(TaskHook, 'useUserTask').mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      handleUpdateTask: vi.fn(),
      handleSortChange: vi.fn()
    });

    // Renderiza el componente Dashboard
    render(<Dashboard />);

    // Verifica que el spinner de carga se muestre
    expect(screen.getByRole('status')).toBeTruthy();  // El spinner tiene el role "status"
    useUserTaskSpy.mockRestore();
  });
});
