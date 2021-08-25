import { useUser } from "../../contexts/user-context";
import { User } from "../../models/User";
jest.mock("../../contexts/user-context");
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

export const mockUseUserReturn = (user: User) => {
  const data: { user: User | null } = { user };
  mockUseUser.mockReturnValue({
    user,
    putUser: (user) => {
      data.user = user;
    },
    removeUser: () => {
      data.user = null;
    },
  });
};
