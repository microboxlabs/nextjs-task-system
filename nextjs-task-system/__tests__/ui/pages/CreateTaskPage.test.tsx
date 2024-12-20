import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTaskPage from "@/app/tasks/create/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import {
  useNotificationStore,
  useTasksStore,
  useAuthStore,
  useUsersStore,
} from "@/stores";

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

    // Check if the form and inputs are rendered
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("should display validation errors when form is submitted empty", async () => {
    render(<CreateTaskPage />);

    // Click the save button without filling the form
    fireEvent.click(screen.getByText(/save/i));

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(
        screen.getByText(/title is a required field/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/description is a required field/i),
      ).toBeInTheDocument();
    });
  });
});
