import { useUser } from "../../contexts/user-context";
import { IUser } from "../../models/User";
jest.mock("../../contexts/user-context");
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

export const mockUseUserReturn = (user: IUser) => {
  const data: { user: IUser | null } = { user };
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
