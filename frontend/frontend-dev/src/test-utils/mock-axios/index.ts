import axios from "axios";
import { LOGIN_PATH, USER_DATA_PATH } from "../../services/routes";
jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

interface IUserServerData {
  data: {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
  };
  token: string;
}

export const createAdminUserServerData = (): IUserServerData => {
  return {
    data: {
      pk: 1,
      username: "admin",
      email: "admin@admin.com",
      first_name: "Admin",
      last_name: "User",
      is_staff: true,
    },
    token: "ADMINUSERTOKENFROMSERVER",
  };
};

export const createStudentUserServerData = (): IUserServerData => {
  return {
    data: {
      pk: 2,
      username: "student",
      email: "student@student.com",
      first_name: "Student",
      last_name: "User",
      is_staff: false,
    },
    token: "STUDENTUSERTOKENFROMSERVER",
  };
};

export const hasCredentials = (username: string, password: string) => (data: {
  username: string;
  password: string;
}) => data.username === username && data.password === password;

export const authorizedToken = (token: string) => (config: {
  headers?: { Authorization?: string };
}) => config?.headers?.Authorization === `Token ${token}`;

export const NOT_FOUND = { status: 404, msg: "404 - NOT FOUND" };
export const BAD_REQUEST = { status: 400, msg: "400 - BAD REQUEST" };

interface IArgsResponse {
  accept: (args: any) => boolean;
  response: any;
}

export const setupMockAxios = (ignoreIfNotFound?: boolean) => {
  const pathArgs: {
    [method: string]: { [path: string]: Array<IArgsResponse> };
  } = {
    post: {},
    get: {},
  };

  const requestMock = (
    method: string,
  ): ((url: string, data?: any) => Promise<unknown>) => (
    url: string,
    data?: any,
  ): Promise<unknown> => {
    const argsResponses = pathArgs[method][url];
    if (!argsResponses)
      return ignoreIfNotFound
        ? Promise.resolve(null)
        : Promise.reject(NOT_FOUND);

    for (let argsResponse of argsResponses) {
      if (argsResponse.accept(data)) {
        return Promise.resolve({ data: argsResponse.response });
      }
    }

    return ignoreIfNotFound
      ? Promise.resolve(null)
      : Promise.reject(BAD_REQUEST);
  };

  const mockAddPathArgs = (method: string, url: string) => ({
    acceptIf: (acceptFunction: (args: any) => boolean) => ({
      andReturn: (response: any) => {
        if (!pathArgs[method][url]) pathArgs[method][url] = [];
        pathArgs[method][url].push({ accept: acceptFunction, response });
      },
    }),
  });

  mockAxios.post.mockImplementation(requestMock("post"));
  mockAxios.get.mockImplementation(requestMock("get"));

  return {
    whenPostReceivedOn: (url: string) => mockAddPathArgs("post", url),
    whenGetReceivedOn: (url: string) => mockAddPathArgs("get", url),
  };
};
