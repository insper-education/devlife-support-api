import { IUser } from "../../models/User";
import * as auth from "../../services/auth";

const mockAuth = auth as jest.Mocked<typeof auth>;

export const setupMockAuth = () => {
  const usersMockDB: IUser[] = [];
  const passwords: { [pk: number]: string } = {};
  const registeredTokens: { [uid: string]: { [token: string]: number } } = {};

  const signUpUserAndReturn = (user: IUser): IUser => {
    passwords[user.pk] = user.username;
    usersMockDB.push(user);
    return user;
  };

  const createAdminUserServerData = (): IUser => {
    return signUpUserAndReturn({
      pk: usersMockDB.length + 1,
      username: "admin",
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "User",
      isStaff: true,
      token: "ADMINUSERTOKENFROMSERVER",
    });
  };

  const createStudentUserServerData = (): IUser => {
    return signUpUserAndReturn({
      pk: usersMockDB.length + 1,
      username: "student",
      email: "student@student.com",
      firstName: "Student",
      lastName: "User",
      isStaff: false,
      token: "STUDENTUSERTOKENFROMSERVER",
    });
  };

  const registerToken = (pk: number, uid: string, token: string) => {
    if (!passwords[pk])
      throw new Error(`No user with pk=${pk}. Create users first.`);
    if (!registeredTokens[uid]) registeredTokens[uid] = {};
    registeredTokens[uid][token] = pk;
  };

  const useToken = (uid: string, token: string) => {
    if (registeredTokens[uid]) registeredTokens[uid][token] = -1;
  };

  const mockLogin = async (
    username: string,
    password: string,
  ): Promise<IUser | null> => {
    let user = null;
    for (let u of usersMockDB) {
      if (u.username === username && passwords[u.pk] === password) {
        user = u;
        break;
      }
    }

    return user;
  };

  const mockResetPassword = async (
    uid: string,
    token: string,
    password1: string,
    password2: string,
  ) => {
    if (password1 !== password2 || !password1.length) return false;
    const pk = registeredTokens[uid]?.[token];
    if (!pk || pk < 0) return false;
    useToken(uid, token);
    passwords[pk] = password1;
    return true;
  };

  let storedUser: IUser | null = null;

  const mockStoreUser = (user: IUser | null) => {
    if (!!user) storedUser = user;
    else storedUser = null;
  };

  const mockRetrieveUser = (): IUser | null => {
    return storedUser;
  };

  mockAuth.login.mockImplementation(mockLogin);
  mockAuth.resetPassword.mockImplementation(mockResetPassword);
  mockAuth.storeUser.mockImplementation(mockStoreUser);
  mockAuth.retrieveUser.mockImplementation(mockRetrieveUser);

  return {
    createAdminUserServerData,
    createStudentUserServerData,
    registerToken,
    useToken,
  };
};
