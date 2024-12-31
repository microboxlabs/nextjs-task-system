import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "@/components/TaskForm";
import { useAuthStore, useUsersStore } from "@/stores";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock the hooks
jest.mock("@/stores", () => ({
  useAuthStore: jest.fn(),
  useUsersStore: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("TaskForm Component", () => {
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
  const mockUseUsersStore = useUsersStore as unknown as jest.Mock;

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, role: "admin", group: { id: 1 } },
    });
    mockUseUsersStore.mockReturnValue({
      users: [],
      getUsers: jest.fn(),
      loading: false,
    });
  });

  it("should render the form elements", () => {
    render(<TaskForm loading={false} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it("should display validation errors when form is submitted empty", async () => {
    render(<TaskForm loading={false} />);

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it("should call onCreate with form data when form is submitted", async () => {
    const mockOnCreate = jest.fn();
    render(<TaskForm onCreate={mockOnCreate} loading={false} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Title",
          description: "Test Description",
        }),
      );
    });
  });

  it("should call handleCancel when cancel button is clicked", async () => {
    const mockUseRouter = useRouter as jest.Mock;
    const mockPush = jest.fn();

    mockUseRouter.mockReturnValue({ push: mockPush });

    render(<TaskForm loading={false} />);
    fireEvent.click(screen.getByText(/cancel/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
