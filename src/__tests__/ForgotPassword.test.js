import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../pages/ForgotPassword.jsx";

const mockNavigate = jest.fn();
const mockResetPassword = jest.fn();

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({
    resetPassword: mockResetPassword,
  }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ForgotPassword page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
  }

  test("renders email input and action buttons", () => {
    const { container } = renderPage();

    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back to login/i })).toBeInTheDocument();
  });

  test("submits reset request and shows success message", async () => {
    mockResetPassword.mockResolvedValueOnce(undefined);
    const { container } = renderPage();

    const emailInput = container.querySelector('input[type="email"]');

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("user@test.com");
    });
    expect(await screen.findByText(/password reset email sent/i)).toBeInTheDocument();
  });

  test("shows loading text while request is in progress", async () => {
    let resolveReset;
    const pending = new Promise((resolve) => {
      resolveReset = resolve;
    });
    mockResetPassword.mockReturnValueOnce(pending);
    const { container } = renderPage();

    const emailInput = container.querySelector('input[type="email"]');

    fireEvent.change(emailInput, { target: { value: "pending@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(screen.getByRole("button", { name: /sending/i })).toBeInTheDocument();
    resolveReset();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
    });
  });

  test("shows error on failure and supports back navigation", async () => {
    mockResetPassword.mockRejectedValueOnce(new Error("Reset failed"));
    const { container } = renderPage();

    const emailInput = container.querySelector('input[type="email"]');

    fireEvent.change(emailInput, { target: { value: "x@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/reset failed/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back to login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
