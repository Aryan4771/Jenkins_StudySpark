import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require("../context/AuthContext.jsx");

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderRoutes() {
    return render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("redirects to login when user is not authenticated", () => {
    useAuth.mockReturnValue({ user: null });
    renderRoutes();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Private Content")).not.toBeInTheDocument();
  });

  test("renders protected content when user exists", () => {
    useAuth.mockReturnValue({ user: { uid: "u1" } });
    renderRoutes();

    expect(screen.getByText("Private Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});
