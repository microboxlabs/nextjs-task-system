import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { useTasks } from '../context/TasksContext';
import { AddTasks } from '@/components/AddTasks';



// Mock del contexto
jest.mock('..context/TasksContext', () => ({
  useTasks: jest.fn(),
}));

// Mock global para fetch
global.fetch = jest.fn();

describe('AddTasks Component', () => {
  beforeEach(() => {
    (useTasks as jest.Mock).mockReturnValue({
      addTask: jest.fn(),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Doe' },
      ]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Add Task button', () => {
    render(<AddTasks />);
    const button = screen.getByText(/\+ Add Task/i);
    expect(button).toBeInTheDocument();
  });

  it('opens the modal when Add Task button is clicked', () => {
    render(<AddTasks />);
    const button = screen.getByText(/\+ Add Task/i);

    fireEvent.click(button);

    const modalHeader = screen.getByText(/Add New Task/i);
    expect(modalHeader).toBeInTheDocument();
  });

  it('renders all input fields in the modal', async () => {
    render(<AddTasks />);
    fireEvent.click(screen.getByText(/\+ Add Task/i));

    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assigned To/i)).toBeInTheDocument();
  });

  it('fetches and displays user options in Assigned To dropdown', async () => {
    render(<AddTasks />);
    fireEvent.click(screen.getByText(/\+ Add Task/i));

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3); // 1 disabled option + 2 users
      expect(options[1]).toHaveTextContent('John Doe');
      expect(options[2]).toHaveTextContent('Jane Doe');
    });
  });

  it('calls onCreateTask when submitting the form', async () => {
    const mockAddTask = jest.fn();
    (useTasks as jest.Mock).mockReturnValue({ addTask: mockAddTask });

    render(<AddTasks />);
    fireEvent.click(screen.getByText(/\+ Add Task/i));

    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByLabelText(/Task Description/i), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: '2024-12-15' },
    });
    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: 'High' },
    });
    fireEvent.change(screen.getByLabelText(/Assigned To/i), {
      target: { value: '1' },
    });

    const submitButton = screen.getByText(/Add Task/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalled();
    });
  });
});
