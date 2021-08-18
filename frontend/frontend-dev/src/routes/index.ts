import AdminHome from "../screens/AdminHome";
import StudentHome from "../screens/StudentHome";

export enum routes {
  STUDENT_HOME = "/",
  ADMIN_HOME = "/faculty",
}

export const routeProps = [
  {
    path: routes.STUDENT_HOME,
    exact: true,
    component: StudentHome,
  },
  {
    path: routes.ADMIN_HOME,
    exact: true,
    component: AdminHome,
  },
];

export const routeNames = {
  [routes.STUDENT_HOME]: "Student Dashboard",
  [routes.ADMIN_HOME]: "Admin Dashboard",
};
