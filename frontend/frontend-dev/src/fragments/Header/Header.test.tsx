import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "../../test-utils/mock-i18next";
import { mockUseUserReturn } from "../../test-utils/mock-user-context";
import { IUser } from "../../models/User";
import Header from ".";

import "../../routes";
jest.mock("../../routes", () => ({
  navRoutes: ["/", "/admin-only"],
  routesData: {
    "/": {
      title: "HOME",
    },
    "/admin-only": {
      title: "ADMIN PAGE",
      permissionTest: (user: IUser | null): boolean => !!user?.isStaff,
    },
  },
}));

const setupMockUser = (isStaff: boolean) => {
  mockUseUserReturn({
    username: "username",
    firstName: "SpongeBob",
    lastName: "SquarePants",
    isStaff,
  } as IUser);
};

const signStudentIn = () => {
  setupMockUser(false);
};

const signAdminIn = () => {
  setupMockUser(true);
};

describe("Header", () => {
  it("shows everything if user is admin", async () => {
    signAdminIn();
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.queryByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("ADMIN PAGE")).toBeInTheDocument();
  });

  it("shows only pages that do not require admin for non-admin user", async () => {
    signStudentIn();
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.queryByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("ADMIN PAGE")).not.toBeInTheDocument();
  });
});
