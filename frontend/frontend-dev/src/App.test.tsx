import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";
import axios from "axios";
jest.mock("axios");
import App from "./App";
import { Router } from "react-router";
import { routes } from "./routes";

const mockAxios = axios as jest.Mocked<typeof axios>;

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

const setupMockAxios = () => {
  const adminUser = {
    pk: 1,
    username: "admin",
    email: "admin@admin.com",
    first_name: "Admin",
    last_name: "User",
    is_staff: true,
  };
  const adminToken = "ADMINUSERTOKENFROMSERVER";
  const studentUser = {
    pk: 1,
    username: "student",
    email: "student@student.com",
    first_name: "Student",
    last_name: "User",
    is_staff: false,
  };
  const studentToken = "STUDENTUSERTOKENFROMSERVER";

  mockAxios.post.mockImplementation((url, { username, password }) => {
    if (url.indexOf("/api/auth/login/") < 0) return Promise.resolve(null);
    if (username === "admin" && password === username)
      return Promise.resolve({ data: { key: adminToken } });
    if (username === "student" && password === username)
      return Promise.resolve({ data: { key: studentToken } });
    return Promise.resolve(null);
  });
  mockAxios.get.mockImplementation((url, config) => {
    if (url.indexOf("/api/auth/user/") < 0) return Promise.resolve(null);
    if (config?.headers?.Authorization === `Token ${adminToken}`)
      return Promise.resolve({
        data: adminUser,
      });
    if (config?.headers?.Authorization === `Token ${studentToken}`)
      return Promise.resolve({
        data: studentUser,
      });
    return Promise.resolve(null);
  });
};

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
