import { fireEvent, render, screen } from "@testing-library/react";
import TaskForm from "../components/TaskForm.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require("../context/AuthContext.jsx");

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ plan: "free" });
  });

  test("renders task form controls", () => {
    const { container } = render(<TaskForm onAdd={jest.fn()} subjects={["SIT313", "Math"]} />);

    expect(screen.getByPlaceholderText(/full stacks/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sit313/i)).toBeInTheDocument();
    expect(container.querySelector("select")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
  });

  test("keeps submit button disabled until title and subject are provided", () => {
    render(<TaskForm onAdd={jest.fn()} subjects={["SIT313"]} />);

    const addButton = screen.getByRole("button", { name: /add task/i });
    expect(addButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/full stacks/i), { target: { value: "Read notes" } });
    expect(addButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/sit313/i), { target: { value: "SIT313" } });
    expect(addButton).not.toBeDisabled();
  });

  test("submits expected payload for free plan and resets form", () => {
    const onAdd = jest.fn();
    const { container } = render(<TaskForm onAdd={onAdd} subjects={["SIT313"]} />);

    const prioritySelect = container.querySelector("select");

    fireEvent.change(screen.getByPlaceholderText(/full stacks/i), { target: { value: "  Finish lab  " } });
    fireEvent.change(screen.getByPlaceholderText(/sit313/i), { target: { value: "  SIT313  " } });
    fireEvent.change(prioritySelect, { target: { value: "High" } });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith({
      title: "  Finish lab  ",
      subject: "  SIT313  ",
      priority: "High",
    });
    expect(screen.getByPlaceholderText(/full stacks/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/sit313/i)).toHaveValue("");
    expect(prioritySelect).toHaveValue("Medium");
  });

  test("shows due date only for pro plan and includes it in payload", () => {
    useAuth.mockReturnValue({ plan: "pro" });
    const onAdd = jest.fn();

    const { container } = render(<TaskForm onAdd={onAdd} subjects={["Math"]} />);

    const dueDateInput = container.querySelector('input[type="date"]');
    expect(dueDateInput).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/full stacks/i), { target: { value: "Revise" } });
    fireEvent.change(screen.getByPlaceholderText(/sit313/i), { target: { value: "Math" } });
    fireEvent.change(dueDateInput, { target: { value: "2026-04-30" } });
    fireEvent.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith({
      title: "Revise",
      subject: "Math",
      priority: "Medium",
      dueAt: "2026-04-30",
    });
  });

  test("does not submit for empty or whitespace-only required fields", () => {
    const onAdd = jest.fn();
    render(<TaskForm onAdd={onAdd} subjects={["Math"]} />);

    fireEvent.change(screen.getByPlaceholderText(/full stacks/i), { target: { value: "   " } });
    fireEvent.change(screen.getByPlaceholderText(/sit313/i), { target: { value: "Math" } });
    fireEvent.submit(screen.getByRole("button", { name: /add task/i }).closest("form"));

    fireEvent.change(screen.getByPlaceholderText(/full stacks/i), { target: { value: "Study" } });
    fireEvent.change(screen.getByPlaceholderText(/sit313/i), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: /add task/i }).closest("form"));

    expect(onAdd).not.toHaveBeenCalled();
  });
});
