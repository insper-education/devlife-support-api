import axios from "axios";
jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

export const setupMockAxios = () => {
    const adminUser = {
      pk: 1,
      username: "admin",
      email: "admin@admin.com",
      first_name: "Admin",
      last_name: "User",
      is_staff: true,
    };
    const adminToken = "ADMINUSERTOKENFROMSERVER";
    const studentUser = {
      pk: 1,
      username: "student",
      email: "student@student.com",
      first_name: "Student",
      last_name: "User",
      is_staff: false,
    };
    const studentToken = "STUDENTUSERTOKENFROMSERVER";
  
    mockAxios.post.mockImplementation((url, { username, password }) => {
      if (url.indexOf("/api/auth/login/") < 0) return Promise.resolve(null);
      if (username === "admin" && password === username)
        return Promise.resolve({ data: { key: adminToken } });
      if (username === "student" && password === username)
        return Promise.resolve({ data: { key: studentToken } });
      return Promise.resolve(null);
    });
    mockAxios.get.mockImplementation((url, config) => {
      if (url.indexOf("/api/auth/user/") < 0) return Promise.resolve(null);
      if (config?.headers?.Authorization === `Token ${adminToken}`)
        return Promise.resolve({
          data: adminUser,
        });
      if (config?.headers?.Authorization === `Token ${studentToken}`)
        return Promise.resolve({
          data: studentUser,
        });
      return Promise.resolve(null);
    });
  };