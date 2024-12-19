import { render, screen } from "@testing-library/react";
import { TaskCard } from "@/components/TaskCard";
import "@testing-library/jest-dom";
import { AssignedTo, TaskPriority, TaskStatus } from "@/types/taskTypes";

// Mock the useUsersStore hook
jest.mock("@/stores/usersStore", () => ({
  useUsersStore: () => ({
    users: [{ id: 1, username: "User 1" }],
    getUsers: jest.fn(),
  }),
}));

const task = {
  id: 1,
  title: "Test Task",
  description: "Description of the test task",
  dueDate: "2024-12-31",
  priority: "high" as TaskPriority,
  assignedTo: { type: "user", id: 1 } as AssignedTo,
  status: "pending" as TaskStatus,
  comments: [],
  createdAt: "2024-01-01T00:00:00Z",
};

describe("TaskCard Component", () => {
  it("should render task details correctly", () => {
    render(<TaskCard task={task} />);

    expect(screen.getByText(task.title)).toBeInTheDocument();

    // Use a function to match the title text
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "h4" &&
          content.includes(task.title)
        );
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/31 Dec/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/high priority/i)).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
  });

  it("should render a link to the task details page", () => {
    render(<TaskCard task={task} />);

    // Use a more flexible matcher for the link
    const link = screen.getByRole("link", { name: /Test Task/i });
    expect(link).toHaveAttribute("href", `/tasks/${task.id}`);
  });
});
