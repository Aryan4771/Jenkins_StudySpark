import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockGoogle = jest.fn();

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({
    login: mockLogin,
    loginWithGoogle: mockGoogle,
  }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderLogin() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  test("renders login form and basic accessible controls", () => {
    const { container } = renderLogin();

    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^log in$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  test("submits credentials and navigates to tasks on success", async () => {
    mockLogin.mockResolvedValueOnce({ uid: "u1" });
    const { container } = renderLogin();

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@test.com", "secret");
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });
  });

  test("shows an error alert when email/password login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { container } = renderLogin();

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "bad@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  test("navigates to forgot-password screen on click", () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /forgot password\?/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
  });

  test("supports google login success and failure paths", async () => {
    mockGoogle.mockResolvedValueOnce({ uid: "u1" });
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    await waitFor(() => {
      expect(mockGoogle).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    mockGoogle.mockRejectedValueOnce(new Error("Google blocked"));
    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Google blocked");
  });
});
