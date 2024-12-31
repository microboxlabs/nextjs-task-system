import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { useRouter } from "next/navigation";
import { useNotificationStore, useAuthStore } from "@/stores";
import { apiRequest } from "@/utils/apiUtils";
import { User } from "@/types";
import "@testing-library/jest-dom";

// Mock the hooks and utilities
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/stores", () => ({
  useNotificationStore: jest.fn(),
  useAuthStore: jest.fn(),
}));

jest.mock("@/utils/apiUtils", () => ({
  apiRequest: jest.fn(),
}));

describe("LoginPage Component", () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseNotificationStore = useNotificationStore as unknown as jest.Mock;
  const mockUseAuthStore = useAuthStore as unknown as jest.Mock;
  const mockApiRequest = apiRequest as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: jest.fn() });
    mockUseNotificationStore.mockReturnValue({
      addNotification: jest.fn(),
    });
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
    });
  });

  it("should render the LoginForm component", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should call handleSubmit when the form is submitted", async () => {
    const user: User = {
      id: 1,
      name: "John Doe",
      username: "testUser",
      role: "user",
      group: { id: 1, name: "group1" },
    };
    mockApiRequest.mockResolvedValue(user);
    const mockPush = jest.fn();
    const mockLogin = jest.fn();
    const mockAddNotification = jest.fn();

    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseAuthStore.mockReturnValue({ login: mockLogin });
    mockUseNotificationStore.mockReturnValue({
      addNotification: mockAddNotification,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith({
        url: "/api/auth",
        method: "POST",
        body: { username: "testUser", password: "password123" },
      });
      expect(mockLogin).toHaveBeenCalledWith(user);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should display an error notification when login fails", async () => {
    const errorMessage = "Invalid credentials";
    mockApiRequest.mockRejectedValue(new Error(errorMessage));
    const mockAddNotification = jest.fn();
    mockUseNotificationStore.mockReturnValue({
      addNotification: mockAddNotification,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledWith({
        message: errorMessage,
        type: "error",
      });
    });
  });
});
