// File: __tests__/components/GithubOAuth.test.tsx
import { render, screen, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
import Home from "../page";
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
  describe("Landing Page", () => {
    it("Should render the title", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Sign up for TaskMaster",
        }),
      ).toBeDefined();
    });
  });
});
