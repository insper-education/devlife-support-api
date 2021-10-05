import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { IUser } from "../../models/User";
import { retrieveUser, storeUser } from "../../services/auth";

interface IUserContextType {
  user: IUser | null;
  putUser: (user: IUser) => void;
  removeUser: () => void;
}

export const UserContext = createContext<IUserContextType>({
  user: null,
  putUser: () => {},
  removeUser: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(retrieveUser());

  const logUserIn = (user: IUser) => {
    storeUser(user);
    setUser(user);
  };
  const logUserOut = () => {
    storeUser(null);
    setUser(null);
  };
  const memoizedValue = useMemo(
    () => ({ user, putUser: logUserIn, removeUser: logUserOut }),
    [user],
  );

  useEffect(() => {
    if (!user) {
      const loadedUser: IUser | null = retrieveUser();
      if (!!loadedUser) logUserIn(loadedUser);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user: memoizedValue.user,
        putUser: memoizedValue.putUser,
        removeUser: memoizedValue.removeUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): IUserContextType => {
  const { user, putUser, removeUser } = useContext(UserContext);
  return { user, putUser, removeUser };
};

export default UserProvider;
