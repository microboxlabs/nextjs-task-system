import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableComponent } from '@/components/tableView/TableComponent';
import { useTasks } from '@/context/TasksContext';

jest.mock('@/context/TasksContext', () => ({
  useTasks: jest.fn(),
}));

describe('TableComponent', () => {
  const mockedUseTasks = useTasks as jest.Mock;

  beforeEach(() => {
    mockedUseTasks.mockReturnValue({
      tasks: [
        {
          id: '1',
          title: 'Task 1',
          description: 'Test Description 1',
          status: 'Pending',
          priority: 'High',
          dueDate: '2024-12-15',
          assignedTo: { name: 'John Doe' },
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Test Description 2',
          status: 'In Progress',
          priority: 'Medium',
          dueDate: '2024-12-20',
          assignedTo: null,
        },
      ],
      filteredTasks: [
        {
          id: '1',
          title: 'Task 1',
          description: 'Test Description 1',
          status: 'Pending',
          priority: 'High',
          dueDate: '2024-12-15',
          assignedTo: { name: 'John Doe' },
        },
      ],
      setFilteredTasks: jest.fn(),
      filters: { status: '', priority: '', dueDate: '', assignedTo: '' },
      setFilters: jest.fn(),
      isAdmin: true,
      addTask: jest.fn(),
      updateTask: jest.fn(),
    });
  });

  test('renders tasks in the table', () => {
    render(<TableComponent />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  test('updates task status when dropdown value changes', async () => {
    render(<TableComponent />);

    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'Completed' } });

    await waitFor(() =>
      expect(mockedUseTasks().setFilteredTasks).toHaveBeenCalledTimes(1)
    );
  });
});
