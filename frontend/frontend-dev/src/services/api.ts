import axios, { AxiosRequestConfig } from "axios";
import { retrieveUser } from "./auth";

export const api = axios.create({
  baseURL: "/"
});

function preRequest(config: AxiosRequestConfig) {
  const user = retrieveUser();
  if (user) {
    config.headers = { ...config.headers, Authorization: `Token ${user.token}` };
  }
  return config;
}

api.interceptors.request.use(preRequest);
