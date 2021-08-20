import axios from "axios";
import { User } from "../../models/User";

export const login = (
  username: string,
  password: string,
): Promise<User | null> => {
  return axios
    .post("/auth/login/", { username, password })
    .then((res) => res.data.key)
    .then((token) => {
      return axios
        .get("/auth/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => res.data)
        .then((userData) => {
          return {
            pk: userData.pk,
            username: userData.username,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            token,
          };
        })
        .catch(() => null);
    })
    .catch(() => null);
};

const USER_KEY = "devlife-user-data";
export const storeUser = (user: User | null) => {
  if (!!user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};
export const retrieveUser = (): User | null => {
  const loadedString = localStorage.getItem(USER_KEY);
  if (!!loadedString) return JSON.parse(loadedString);
  return null;
};
