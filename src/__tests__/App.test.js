import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

jest.mock("react-calendar", () => () => <div>Mock Calendar</div>);

describe("App", () => {
  let errorSpy;
  let warnSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  test("renders app without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});
