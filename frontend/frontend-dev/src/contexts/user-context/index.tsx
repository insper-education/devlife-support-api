import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { User } from "../../models/User";
import { retrieveUser, storeUser } from "../../services/auth";

interface UserContextType {
  user: User | null;
  putUser: (user: User) => void;
  removeUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  putUser: () => {},
  removeUser: () => {},
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logUserIn = (user: User) => {
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
      const loadedUser: User | null = retrieveUser();
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

export const useUser = (): UserContextType => {
  const { user, putUser, removeUser } = useContext(UserContext);
  return { user, putUser, removeUser };
};

export default UserProvider;

/////
// import React, {
//     createContext,
//     useState,
//     useMemo,
//     useContext,
//     useEffect,
//   } from "react";
//   import { User } from "../../models/User";
//   import { retrieveUser, storeUser } from "../../services/auth";

//   interface UserContextType {
//     user: User | null;
//     putUser: (user: User) => void;
//     removeUser: () => void;
//   }

//   export const UserContext = createContext<{
//     user: User | null;
//     setUser: (user: User | null) => void;
//   }>({
//     user: null,
//     setUser: () => {},
//   });

//   const UserProvider: React.FC = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);

//     const memoizedValue = useMemo(() => ({ user, setUser }), [user]);

//     useEffect(() => {
//       if (!user) {
//         const loadedUser: User | null = retrieveUser();
//         if (!!loadedUser) {
//           storeUser(loadedUser);
//           setUser(loadedUser);
//         }
//       }
//     }, [user]);

//     return (
//       <UserContext.Provider
//         value={{
//           user: memoizedValue.user,
//           setUser: memoizedValue.setUser,
//         }}>
//         {children}
//       </UserContext.Provider>
//     );
//   };

//   export const useUser = (): UserContextType => {
//     const { user, setUser } = useContext(UserContext);
//     const logUserIn = (user: User) => {
//       storeUser(user);
//       setUser(user);
//     };
//     const logUserOut = () => {
//       storeUser(null);
//       setUser(null);
//     };

//     return { user, putUser: logUserIn, removeUser: logUserOut };
//   };

//   export default UserProvider;
