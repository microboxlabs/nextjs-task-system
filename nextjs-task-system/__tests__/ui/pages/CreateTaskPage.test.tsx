import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskPage from "@/app/tasks/create/page";
import { useRouter } from "next/navigation";
import {
  useAuthStore,
  useNotificationStore,
  useTasksStore,
  useUsersStore,
} from "@/stores";
import "@testing-library/jest-dom";

// Mock the hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/stores", () => ({
  useNotificationStore: jest.fn(),
  useTasksStore: jest.fn(),
  useAuthStore: jest.fn(),
  useUsersStore: jest.fn(),
}));

describe("CreateTaskPage Component", () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseNotificationStore = useNotificationStore as unknown as jest.Mock;
  const mockUseTasksStore = useTasksStore as unknown as jest.Mock;
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
  const mockUseUsersStore = useUsersStore as unknown as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: jest.fn() });
    mockUseNotificationStore.mockReturnValue({
      addNotification: jest.fn(),
    });
    mockUseTasksStore.mockReturnValue({
      createTask: jest.fn(),
      loading: false,
    });
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, role: "admin", group: { id: 1 } },
    });
    mockUseUsersStore.mockReturnValue({
      users: [],
      getUsers: jest.fn(),
      loading: false,
    });
  });

  it("should render the task creation form", () => {
    render(<CreateTaskPage />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("should call handleSubmit when the form is submitted", async () => {
    const mockCreateTask = jest.fn();
    const mockPush = jest.fn();
    const mockAddNotification = jest.fn();

    mockUseTasksStore.mockReturnValue({
      createTask: mockCreateTask,
      loading: false,
    });
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseNotificationStore.mockReturnValue({
      addNotification: mockAddNotification,
    });

    render(<CreateTaskPage />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Title",
          description: "Test Description",
        }),
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: "Task created successfully.",
        type: "success",
      });
    });
  });

  it("should display an error notification when task creation fails", async () => {
    const errorMessage = "Error creating task.";
    const mockCreateTask = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockAddNotification = jest.fn();

    mockUseTasksStore.mockReturnValue({
      createTask: mockCreateTask,
      loading: false,
    });
    mockUseNotificationStore.mockReturnValue({
      addNotification: mockAddNotification,
    });

    render(<CreateTaskPage />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: errorMessage + " Please try again.",
        type: "error",
      });
    });
  });
});
