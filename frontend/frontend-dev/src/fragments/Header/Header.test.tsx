import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import "react-i18next";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (text: string) => text }),
}));
import { useUser } from "../../contexts/user-context";
jest.mock("../../contexts/user-context");
import "../../routes";
jest.mock("../../routes", () => ({
  navRoutes: ["/", "/admin-only"],
  routesData: {
    "/": {
      title: "HOME",
    },
    "/admin-only": {
      title: "ADMIN PAGE",
      permissionTest: (user: User | null): boolean => !!user?.isStaff,
    },
  },
}));
import { User } from "../../models/User";
import Header from ".";

const setupMockUser = (isStaff: boolean) => {
  const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
  mockUseUser.mockReturnValue({
    user: {
      username: "username",
      firstName: "SpongeBob",
      lastName: "SquarePants",
      isStaff,
    } as User,
    putUser: () => {},
    removeUser: () => {},
  });
};

describe("Header", () => {
  it("shows everything if user is admin", async () => {
    setupMockUser(true);
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.queryByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("ADMIN PAGE")).toBeInTheDocument();
  });

  it("shows only pages that do not require admin for non-admin user", async () => {
    setupMockUser(false);
    render(<Header />, { wrapper: MemoryRouter });
    expect(screen.queryByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("ADMIN PAGE")).not.toBeInTheDocument();
  });
});
