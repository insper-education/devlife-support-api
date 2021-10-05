import axios from "axios";
import { IUser } from "../../models/User";
import { LOGIN_PATH, USER_DATA_PATH } from "../routes";

export const login = async (
  username: string,
  password: string
): Promise<IUser | null> => {
  return axios
    .post(LOGIN_PATH, { username, password })
    .then((res) => res.data.key)
    .then(async (token) => {
      return axios
        .get(USER_DATA_PATH, {
          headers: {
            Authorization: `Token ${token}`
          }
        })
        .then((res) => res.data)
        .then((userData) => {
          return {
            pk: userData.pk,
            username: userData.username,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            isStaff: userData.is_staff,
            token
          };
        })
        .catch(() => null);
    })
    .catch(() => null);
};

const USER_KEY = "devlife-user-data";
export const storeUser = (user: IUser | null) => {
  if (!!user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};
export const retrieveUser = (): IUser | null => {
  const loadedString = localStorage.getItem(USER_KEY);
  if (!!loadedString) return JSON.parse(loadedString);
  return null;
};
