import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { setupMockAxios } from "./test-utils/mock-axios"; // Mocks must come before import App
import { createMemoryHistory } from "history";

import App from "./App";
import { Router } from "react-router";
import { routes } from "./routes";

const renderApp = (currentLocation: string) => {
  const history = createMemoryHistory();
  history.push(currentLocation);
  render(
    <Router history={history}>
      <App />
    </Router>,
  );
  return history;
};

let setItemSpy: jest.SpyInstance<void, [key: string, value: string]>;
let getItemSpy: jest.SpyInstance<string | null, [key: string]>;
let mockStorage: { [key: string]: string } = {};
beforeAll(() => {
  setItemSpy = jest
    .spyOn(global.Storage.prototype, "setItem")
    .mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
  getItemSpy = jest
    .spyOn(global.Storage.prototype, "getItem")
    .mockImplementation((key) => mockStorage[key]);
});

afterAll(() => {
  // then, detach our spies to avoid breaking other test suites
  getItemSpy.mockRestore();
  setItemSpy.mockRestore();
  mockStorage = {};
});

const fillLoginForm = async (username: string, password: string) => {
  const userInput = await screen.getByLabelText(/us.*r.*/i);
  const passwordInput = await screen.getByLabelText(/pass.*|senha/i);
  const submitButton = await screen.getByRole("button", {
    name: /sign.*|entrar/i,
  });

  userEvent.type(userInput, username);
  userEvent.type(passwordInput, password);
  userEvent.click(submitButton);
};

describe("App navigation", () => {
  it("admin user logs in and is redirected to student dashboard", async () => {
    // Access student page while not logged in
    let history: any;
    history = renderApp(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    setupMockAxios();
    await act(async () => {
      await fillLoginForm("admin", "admin");
    });

    expect(history.location.pathname).toBe(routes.STUDENT_HOME);
  });

  it("admin user logs in and is redirected to instructor dashboard", async () => {
    // Access admin page while not logged in
    let history: any;
    history = renderApp(routes.INSTRUCTOR_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    setupMockAxios();
    await act(async () => {
      await fillLoginForm("admin", "admin");
    });

    expect(history.location.pathname).toBe(routes.INSTRUCTOR_HOME);
  });

  it("student user logs in and is redirected to student dashboard", async () => {
    // Access student page while not logged in
    let history: any;
    history = renderApp(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    setupMockAxios();
    await act(async () => {
      await fillLoginForm("student", "student");
    });

    expect(history.location.pathname).toBe(routes.STUDENT_HOME);

    // Try to access admin page
    history.push(routes.INSTRUCTOR_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);
  });

  it("student user logs in and is redirected to instructor dashboard", async () => {
    // Access admin page while not logged in
    let history: any;
    history = renderApp(routes.INSTRUCTOR_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    setupMockAxios();
    await act(async () => {
      await fillLoginForm("student", "student");
    });

    expect(history.location.pathname).toBe(routes.LOGIN);
  });
});
