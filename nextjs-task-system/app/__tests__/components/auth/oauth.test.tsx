// File: __tests__/components/GithubOAuth.test.tsx
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, afterEach } from "vitest";
import GithubOAuth from "../../../components/auth/oauth";
import * as authLib from "@/lib/auth";

// Mock the auth library
vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
}));

// Mock Lucide React icons to avoid any rendering issues
vi.mock("lucide-react", () => ({
  Github: () => <svg data-testid="github-icon" />,
}));

describe("GithubOAuth Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the GitHub sign in button", () => {
    render(<GithubOAuth />);

    // Check button text
    const button = screen.getByRole("button", { name: /sign up with github/i });
    expect(button).toBeDefined();

    // Check GitHub icon
    const icon = screen.getByTestId("github-icon");
    expect(icon).toBeDefined();
  });

  it("calls signIn with github provider when button is clicked", async () => {
    // Create a user event instance
    const user = userEvent.setup();

    // Spy on the signIn function
    const signInMock = vi.spyOn(authLib, "signIn");
    signInMock.mockImplementation(async () => {});
    render(<GithubOAuth />);

    // Simulate form submission
    await user.click(screen.getByRole("button"));

    // Verify signIn was called with 'github'
    expect(signInMock).toHaveBeenCalledWith("github");
  });
});
