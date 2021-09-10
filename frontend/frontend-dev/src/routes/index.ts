import { RouteProps } from "react-router";
import { User } from "../models/User";
import InstructorHome from "../screens/InstructorHome";
import Login from "../screens/Login";
import StudentHome from "../screens/StudentHome";

export enum routes {
  STUDENT_HOME = "/",
  INSTRUCTOR_HOME = "/instructor",
  LOGIN = "/login",
}

interface RouteData {
  title: string;
  permissionTest?: (user: User | null) => boolean;
  props: RouteProps;
}

export const routesData: { [route: string]: RouteData } = {};
routesData[routes.STUDENT_HOME] = {
  title: "Student Dashboard",
  props: {
    path: routes.STUDENT_HOME,
    exact: true,
    component: StudentHome,
  },
};
routesData[routes.INSTRUCTOR_HOME] = {
  title: "Instructor Dashboard",
  permissionTest: (user: User | null): boolean => !!user?.isStaff,
  props: {
    path: routes.INSTRUCTOR_HOME,
    exact: true,
    component: InstructorHome,
  },
};
routesData[routes.LOGIN] = {
  title: "Login",
  props: {
    path: routes.LOGIN,
    exact: true,
    component: Login,
  },
};

export const navRoutes: string[] = [routes.INSTRUCTOR_HOME];
