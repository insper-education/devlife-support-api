/* eslint-disable import/first */
import { act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupMockAuth } from "../test-utils/mock-auth";
jest.mock("../services/auth");

import { routes } from "../routes";
import {
  fillPassword,
  fillPasswordConfirmation,
  fillUsername,
  accessPage,
  signIn,
  clickSetPassword,
  startAt,
  searchForMessage,
} from "./interactions";
import { dynamicPathname } from "../helpers";
import { LOGIN_PATH } from "../services/routes";

describe("App navigation", () => {
  beforeEach(() => {
    const { createAdminUserServerData, createStudentUserServerData } =
      setupMockAuth();

    createAdminUserServerData();
    createStudentUserServerData();
  });

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
      await fillUsername("student");
      await fillPassword("student");
      await signIn();
    });

    expect(history.location.pathname).toBe(routes.STUDENT_HOME);

    accessPage(routes.INSTRUCTOR_HOME, history);
    expect(history.location.pathname).toBe(routes.LOGIN);
  });

  it("student user logs in and is redirected to login because they don't have permission to access instructor dashboard", async () => {
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

describe("Password reset", () => {
  let createStudentUserServerData,
    registerToken: (pk: number, uid: string, token: string) => void,
    useToken;

  beforeEach(() => {
    ({ createStudentUserServerData, registerToken, useToken } =
      setupMockAuth());
    createStudentUserServerData();
  });

  it("user resets password", async () => {
    registerToken(1, "abc", "defghijkl");
    const pathname = dynamicPathname(routes.PASSWORD_RESET, {
      uid: "abc",
      token: "defghijkl",
    });
    const history = startAt(pathname);
    expect(history.location.pathname).toBe(pathname);

    await act(async () => {
      await fillPassword("newpass");
      await fillPasswordConfirmation("newpass");
      await clickSetPassword();
    });

    expect(history.location.pathname).toBe(routes.LOGIN);
  });

  it("user tries to reset password with used token", async () => {
    const pathname = dynamicPathname(routes.PASSWORD_RESET, {
      uid: "abc",
      token: "defghijkl",
    });
    const history = startAt(pathname);
    expect(history.location.pathname).toBe(pathname);

    await act(async () => {
      await fillPassword("newpass");
      await fillPasswordConfirmation("newpass");
      await clickSetPassword();
    });

    expect(history.location.pathname).toBe(pathname);
    expect(
      searchForMessage(
        /Invalid password reset link|Link de redefinição de senha inválido/i,
      ),
    ).toBeInTheDocument();
  });

  it("user tries to reset password with same token twice", async () => {
    registerToken(1, "abc", "defghijkl");
    const pathname = dynamicPathname(routes.PASSWORD_RESET, {
      uid: "abc",
      token: "defghijkl",
    });
    const history = startAt(pathname);
    expect(history.location.pathname).toBe(pathname);

    await act(async () => {
      await fillPassword("newpass");
      await fillPasswordConfirmation("newpass");
      await clickSetPassword();
    });

    expect(history.location.pathname).toBe(routes.LOGIN);

    // Try to use same link again
    history.push(pathname);

    await act(async () => {
      await fillPassword("newerpass");
      await fillPasswordConfirmation("newerpass");
      await clickSetPassword();
    });

    expect(history.location.pathname).toBe(pathname);
    expect(
      searchForMessage(
        /Invalid password reset link|Link de redefinição de senha inválido/i,
      ),
    ).toBeInTheDocument();
  });
});
