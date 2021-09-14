import axios, { AxiosRequestConfig } from "axios";
import { retrieveUser } from "./auth";

export const api = axios.create({
  baseURL: "/"
});

function preRequest(config: AxiosRequestConfig) {
  const user = retrieveUser();
  if (user) {
    config.headers = { ...config.headers, Authorization: `Token ${user.token}` };
  } else {
    // handle "not signed in" case for current user
    // what should happen if current user tries to make an 
    // authenticaded api call without credentials?
  }
  return config;
}

api.interceptors.request.use(preRequest);
