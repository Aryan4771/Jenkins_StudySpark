import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TasksProvider, useTasks } from "../context/TasksContext.jsx";

let mockUser = { uid: "user-1" };

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ user: mockUser }),
}));

function TasksHarness() {
  const { tasks, subjects, addTask, toggleDone, removeTask } = useTasks();

  return (
    <div>
      <div data-testid="count">{tasks.length}</div>
      <div data-testid="subjects">{subjects.join(",")}</div>
      <div data-testid="first-title">{tasks[0]?.title || ""}</div>
      <div data-testid="first-done">{String(tasks[0]?.done ?? "")}</div>

      <button
        onClick={() =>
          addTask({
            title: "Read chapter",
            subject: "Math",
            priority: "High",
          })
        }
      >
        Add
      </button>

      <button onClick={() => tasks[0] && toggleDone(tasks[0].id, tasks[0].done)}>Toggle</button>
      <button onClick={() => tasks[0] && removeTask(tasks[0].id)}>Remove</button>
    </div>
  );
}

describe("TasksContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { uid: "user-1" };

    Object.defineProperty(global, "crypto", {
      value: {
        randomUUID: jest.fn(() => "task-uuid-1"),
      },
      configurable: true,
    });
  });

  test("loads user tasks from localStorage on mount", async () => {
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValueOnce(
        JSON.stringify([{ id: "t1", title: "Stored", subject: "SIT313", priority: "Medium", done: false }])
      );

    render(
      <TasksProvider>
        <TasksHarness />
      </TasksProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
      expect(screen.getByTestId("first-title")).toHaveTextContent("Stored");
      expect(screen.getByTestId("subjects")).toHaveTextContent("SIT313");
    });
  });

  test("handles invalid localStorage JSON safely", async () => {
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce("{invalid-json");

    render(
      <TasksProvider>
        <TasksHarness />
      </TasksProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
  });

  test("adds task, updates derived subjects, and persists to localStorage", async () => {
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce(JSON.stringify([]));
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

    render(
      <TasksProvider>
        <TasksHarness />
      </TasksProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
      expect(screen.getByTestId("first-title")).toHaveTextContent("Read chapter");
      expect(screen.getByTestId("subjects")).toHaveTextContent("Math");
      expect(setItemSpy).toHaveBeenCalled();
    });
  });

  test("toggles done state and removes task", async () => {
    jest.spyOn(window.localStorage.__proto__, "getItem").mockReturnValueOnce(JSON.stringify([]));

    render(
      <TasksProvider>
        <TasksHarness />
      </TasksProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getByTestId("first-done")).toHaveTextContent("false");
    });

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByTestId("first-done")).toHaveTextContent("true");
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
  });

  test("does not mutate tasks when no authenticated user", async () => {
    mockUser = null;
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

    render(
      <TasksProvider>
        <TasksHarness />
      </TasksProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });
});
