import InstructorHome from "../screens/InstructorHome";
import Login from "../screens/Login";
import StudentHome from "../screens/StudentHome";

export enum routes {
  STUDENT_HOME = "/",
  INSTRUCTOR_HOME = "/instructor",
  LOGIN = "/login",
}

export const routeProps = [
  {
    path: routes.STUDENT_HOME,
    exact: true,
    component: StudentHome,
  },
  {
    path: routes.INSTRUCTOR_HOME,
    exact: true,
    component: InstructorHome,
  },
  {
    path: routes.LOGIN,
    exact: true,
    component: Login,
  },
];

export const routeNames = {
  [routes.STUDENT_HOME]: "Student Dashboard",
  [routes.INSTRUCTOR_HOME]: "Instructor Dashboard",
};
