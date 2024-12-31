import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuthStore, useTasksStore } from "@/stores";
import { AssignedTo } from "@/types/taskTypes";
import "@testing-library/jest-dom";

// Mock the useAuthStore and useTasksStore hooks
jest.mock("@/stores", () => ({
  useAuthStore: jest.fn(),
  useTasksStore: jest.fn(),
}));

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
      Promise.resolve({
        success: true,
        data: [
          {
            id: 1,
            title: "Task 1",
            status: "pending",
            priority: "high",
            assignedTo: { type: "user", id: 1 } as AssignedTo,
            createdAt: "2024-01-01T00:00:00Z",
            dueDate: "2024-12-31",
          },
          {
            id: 2,
            title: "Task 2",
            status: "inProgress",
            priority: "medium",
            assignedTo: { type: "user", id: 2 } as AssignedTo,
            createdAt: "2024-01-02T00:00:00Z",
            dueDate: "2024-12-30",
          },
        ],
      }),
  }),
) as jest.Mock;

describe("DashboardPage Component", () => {
  // Define mock functions to use for the hooks
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
  const mockUseTasksStore = useTasksStore as unknown as jest.Mock;

  beforeEach(() => {
    // Mock the return values of the hooks
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, role: "admin", group: { id: 1 } },
    });
    mockUseTasksStore.mockReturnValue({
      tasks: [
        {
          id: 1,
          title: "Task 1",
          status: "pending",
          priority: "high",
          assignedTo: { type: "user", id: 1 } as AssignedTo,
          createdAt: "2024-01-01T00:00:00Z",
          dueDate: "2024-12-31",
        },
        {
          id: 2,
          title: "Task 2",
          status: "inProgress",
          priority: "medium",
          assignedTo: { type: "user", id: 2 } as AssignedTo,
          createdAt: "2024-01-02T00:00:00Z",
          dueDate: "2024-12-30",
        },
      ],
      getTasks: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it("should render loading message when loading", () => {
    mockUseTasksStore.mockReturnValueOnce({
      loading: true,
      getTasks: jest.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("should render error message when there is an error", () => {
    mockUseTasksStore.mockReturnValueOnce({
      error: "Failed to load tasks",
      getTasks: jest.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
  });

  it("should render authentication message when user is not authenticated", () => {
    mockUseAuthStore.mockReturnValueOnce({ user: null });
    render(<DashboardPage />);
    expect(screen.getByText("User not authenticated.")).toBeInTheDocument();
  });

  it("should apply filters and sort tasks", async () => {
    render(<DashboardPage />);

    // Simulate changing the status filter to "pending"
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "pending" },
    });

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });
});
