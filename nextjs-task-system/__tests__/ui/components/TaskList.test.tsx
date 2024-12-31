import { render, screen, act } from "@testing-library/react";
import { TaskList } from "@/components/TaskList";
import "@testing-library/jest-dom";
import { TaskPriority, TaskStatus, AssignedTo } from "@/types/taskTypes";

// Mock the useUsersStore hook
jest.mock("@/stores/usersStore", () => ({
  useUsersStore: () => ({
    users: [
      { id: 1, username: "User 1" },
      { id: 2, username: "User 2" },
    ],
    getUsers: jest.fn(),
  }),
}));

const tasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    dueDate: "2024-12-31",
    priority: "high" as TaskPriority,
    assignedTo: { type: "user", id: 1 } as AssignedTo,
    status: "pending" as TaskStatus,
    comments: [],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    dueDate: "2024-12-30",
    priority: "medium" as TaskPriority,
    assignedTo: { type: "user", id: 2 } as AssignedTo,
    status: "inProgress" as TaskStatus,
    comments: [],
    createdAt: "2024-01-02T00:00:00Z",
  },
];

describe("TaskList Component", () => {
  it("should render a list of tasks", async () => {
    await act(async () => {
      render(<TaskList title="Test Tasks" tasks={tasks} />);
    });

    // Check that the title of the TaskList is rendered
    expect(screen.getByText("Test Tasks")).toBeInTheDocument();

    // Check that each task title is rendered
    tasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it("should display a message when no tasks are available", () => {
    render(<TaskList title="Empty Task List" tasks={[]} />);

    expect(screen.getByText("No tasks available.")).toBeInTheDocument();
  });
});
