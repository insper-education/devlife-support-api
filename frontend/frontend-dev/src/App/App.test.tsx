import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  createAdminUserServerData,
  setupMockAxios,
  createStudentUserServerData,
  hasCredentials,
  authorizedToken,
} from "../test-utils/mock-axios"; // Mocks must come before import App

import { routes } from "../routes";
import { LOGIN_PATH, USER_DATA_PATH } from "../services/routes";
import {
  mockLocalStorage,
  tearDownLocalStorage,
} from "../test-utils/mock-local-storage";
import {
  fillPassword,
  fillUsername,
  accessPage,
  signIn,
  startAt,
} from "./interactions";

beforeEach(() => {
  mockLocalStorage();
  const { whenPostReceivedOn, whenGetReceivedOn } = setupMockAxios();

  const usersData = [
    createAdminUserServerData(),
    createStudentUserServerData(),
  ];
  usersData.forEach((userData) => {
    whenPostReceivedOn(LOGIN_PATH)
      .acceptIf(hasCredentials(userData.data.username, userData.data.username))
      .andReturn({ key: userData.token });

    whenGetReceivedOn(USER_DATA_PATH)
      .acceptIf(authorizedToken(userData.token))
      .andReturn(userData.data);
  });
});

afterEach(() => {
  tearDownLocalStorage();
});

describe("App navigation", () => {
  it("admin user logs in and is redirected to student dashboard", async () => {
    // Access student page while not logged in
    let history = startAt(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    await act(async () => {
      await fillUsername("admin");
      await fillPassword("admin");
      await signIn();
    });

    expect(history.location.pathname).toBe(routes.STUDENT_HOME);
  });

  it("admin user logs in and is redirected to instructor dashboard", async () => {
    // Access admin page while not logged in
    let history = startAt(routes.INSTRUCTOR_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    await act(async () => {
      await act(async () => {
        await fillUsername("admin");
        await fillPassword("admin");
        await signIn();
      });
    });

    expect(history.location.pathname).toBe(routes.INSTRUCTOR_HOME);
  });

  it("student user logs in and is redirected to student dashboard", async () => {
    // Access student page while not logged in
    let history = startAt(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    await act(async () => {
      await act(async () => {
        await fillUsername("student");
        await fillPassword("student");
        await signIn();
      });
    });

    expect(history.location.pathname).toBe(routes.STUDENT_HOME);

    accessPage(routes.INSTRUCTOR_HOME, history);
    expect(history.location.pathname).toBe(routes.LOGIN);
  });

  it("student user logs in and is redirected to instructor dashboard", async () => {
    // Access admin page while not logged in
    let history = startAt(routes.INSTRUCTOR_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);

    await act(async () => {
      await fillUsername("student");
      await fillPassword("student");
      await signIn();
    });

    expect(history.location.pathname).toBe(routes.LOGIN);
  });
});
