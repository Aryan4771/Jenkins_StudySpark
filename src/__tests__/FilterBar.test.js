import { fireEvent, render, screen } from "@testing-library/react";
import FilterBar from "../components/FilterBar.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require("../context/AuthContext.jsx");

describe("FilterBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ plan: "free" });
  });

  test("renders subject, priority, and search controls", () => {
    render(
      <FilterBar
        subjects={["All", "SIT313"]}
        value={{ subject: "All", priority: "All", query: "" }}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  test("updates subject and query through onChange", () => {
    const onChange = jest.fn();
    render(
      <FilterBar
        subjects={["All", "SIT313"]}
        value={{ subject: "All", priority: "All", query: "" }}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "SIT313" } });
    expect(onChange).toHaveBeenLastCalledWith({
      subject: "SIT313",
      priority: "All",
      query: "",
    });

    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), { target: { value: "report" } });
    expect(onChange).toHaveBeenLastCalledWith({
      subject: "All",
      priority: "All",
      query: "report",
    });
  });

  test("clear button resets filters for free plan", () => {
    const onChange = jest.fn();
    render(
      <FilterBar
        subjects={["All", "Math"]}
        value={{ subject: "Math", priority: "High", query: "mid" }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(onChange).toHaveBeenCalledWith({
      subject: "All",
      priority: "All",
      query: "",
    });
  });

  test("shows due date range only for pro and clear resets due filters", () => {
    useAuth.mockReturnValue({ plan: "pro" });
    const onChange = jest.fn();

    render(
      <FilterBar
        subjects={["All", "Math"]}
        value={{ subject: "Math", priority: "High", query: "x", dueFrom: "2026-04-01", dueTo: "2026-04-30" }}
        onChange={onChange}
      />
    );

    expect(screen.getByLabelText(/due from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due to/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(onChange).toHaveBeenCalledWith({
      subject: "All",
      priority: "All",
      query: "",
      dueFrom: "",
      dueTo: "",
    });
  });
});
