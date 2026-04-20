import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Groups from "../pages/Groups.jsx";

const mockNavigate = jest.fn();
const mockAddDoc = jest.fn();
const mockOnSnapshot = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockServerTimestamp = jest.fn(() => "SERVER_TS");

let mockUser = { email: "owner@test.com" };

jest.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("../firebase.js", () => ({
  db: { __db: true },
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("firebase/firestore", () => ({
  collection: (...args) => mockCollection(...args),
  addDoc: (...args) => mockAddDoc(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  serverTimestamp: () => mockServerTimestamp(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    section: ({ children, initial, animate, transition, ...props }) => <section {...props}>{children}</section>,
    div: ({ children, initial, animate, transition, ...props }) => <div {...props}>{children}</div>,
  },
}));

function createSnapshot(rows) {
  return {
    forEach: (cb) => rows.forEach((r) => cb({ id: r.id, data: () => r.data })),
  };
}

describe("Groups page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { email: "owner@test.com" };

    mockCollection.mockReturnValue("groups-ref");
    mockWhere.mockReturnValue("where-ref");
    mockQuery.mockReturnValue("query-ref");
    mockServerTimestamp.mockReturnValue("SERVER_TS");
    mockOnSnapshot.mockImplementation((ref, callback) => {
      callback(createSnapshot([]));
      return jest.fn();
    });
    mockAddDoc.mockResolvedValue({ id: "group-123" });
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );
  }

  test("shows login prompt when user is not available", () => {
    mockUser = null;
    renderPage();

    expect(screen.getByText(/please login to join or create study groups/i)).toBeInTheDocument();
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  test("renders empty groups state from firestore snapshot", async () => {
    renderPage();

    expect(await screen.findByText(/you haven't joined any groups yet/i)).toBeInTheDocument();
    expect(mockWhere).toHaveBeenCalledWith("members", "array-contains", "owner@test.com");
    expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
  });

  test("creates group with invite email and navigates to room", async () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/history finals grp/i), { target: { value: "Project Team" } });
    fireEvent.change(screen.getByPlaceholderText(/peer@example.com/i), { target: { value: "peer@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
    });
    expect(mockAddDoc).toHaveBeenCalledWith("groups-ref", expect.objectContaining({
      name: "Project Team",
      members: ["owner@test.com", "peer@test.com"],
      createdBy: "owner@test.com",
      createdAt: "SERVER_TS",
    }));
    expect(mockServerTimestamp).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/group/group-123");
  });

  test("handles duplicate self-invite and create errors", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockAddDoc.mockRejectedValueOnce(new Error("Write failed"));

    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/history finals grp/i), { target: { value: "Solo Group" } });
    fireEvent.change(screen.getByPlaceholderText(/peer@example.com/i), { target: { value: "owner@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith("groups-ref", expect.objectContaining({
        name: "Solo Group",
        members: ["owner@test.com"],
        createdBy: "owner@test.com",
        createdAt: "SERVER_TS",
      }));
    });

    expect(alertSpy).toHaveBeenCalledWith("Failed to create group. Are Firestore rules configured?");
    errorSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
