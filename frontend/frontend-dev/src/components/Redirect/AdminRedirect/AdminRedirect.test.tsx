import { Router, Route } from "react-router";
import { createMemoryHistory } from "history";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useUser } from "../../../contexts/user-context";
jest.mock("../../../contexts/user-context");
import { routes } from "../../../routes";
import AdminRedirect from ".";
import { User } from "../../../models/User";

const setupMockUser = (create: boolean, isStaff: boolean) => {
  const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
  mockUseUser.mockReturnValue({
    user: create
      ? ({
          username: "admin",
          firstName: "Admin",
          lastName: "User",
          isStaff,
        } as User)
      : null,
    putUser: () => {},
    removeUser: () => {},
  });
};

const renderRoutes = (initialRoute: string) => {
  const history = createMemoryHistory();
  history.push(initialRoute);
  render(
    <Router history={history}>
      <AdminRedirect />
      <Route path={routes.STUDENT_HOME} exact>
        Target Page
      </Route>
      <Route path={routes.LOGIN} exact>
        Login Page
      </Route>
    </Router>,
  );
  return history;
};

describe("LoginRedirect", () => {
  it("redirects to login if no user is found", async () => {
    setupMockUser(false, false);
    const history = renderRoutes(routes.LOGIN);
    expect(history.location.pathname).toBe(routes.LOGIN);
    expect(screen.queryByText("Target Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).toBeInTheDocument();
  });

  it("doesn't redirect to login if user is found and is admin", async () => {
    setupMockUser(true, true);
    const history = renderRoutes(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.STUDENT_HOME);
    expect(screen.queryByText("Target Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redirects to login if user is found, but is not admin", () => {
    setupMockUser(true, false);
    const history = renderRoutes(routes.STUDENT_HOME);
    expect(history.location.pathname).toBe(routes.LOGIN);
    expect(screen.queryByText("Target Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).toBeInTheDocument();
  });
});
