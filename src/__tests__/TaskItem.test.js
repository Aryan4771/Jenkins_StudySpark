import { fireEvent, render, screen } from "@testing-library/react";
import TaskItem from "../components/TaskItem.jsx";

jest.mock("canvas-confetti", () => jest.fn());
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, transition, ...props }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("TaskItem", () => {
  const baseTask = {
    id: "task-1",
    title: "Finish assignment",
    subject: "Math",
    priority: "High",
    done: false,
    dueAt: "2026-04-25",
  };

  test("renders task details", () => {
    render(
      <TaskItem
        task={baseTask}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        index={0}
      />
    );

    expect(screen.getByText("Finish assignment")).toBeInTheDocument();
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText(/Due:/i)).toBeInTheDocument();
  });

  test("calls onToggle with inverse done state", () => {
    const onToggle = jest.fn();

    render(
      <TaskItem
        task={baseTask}
        onToggle={onToggle}
        onDelete={jest.fn()}
        index={0}
      />
    );

    fireEvent.click(screen.getByLabelText("Mark complete"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("task-1", true);
  });

  test("calls onDelete with task id", () => {
    const onDelete = jest.fn();

    render(
      <TaskItem
        task={baseTask}
        onToggle={jest.fn()}
        onDelete={onDelete}
        index={0}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete task/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });
});
