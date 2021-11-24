import { RouteProps } from "react-router";
import { IUser } from "../models/User";
import InstructorHome from "../screens/InstructorHome";
import Login from "../screens/Login";
import PasswordChange from "../screens/PasswordChange";
import PasswordLost from "../screens/PasswordLost";
import StudentHome from "../screens/StudentHome";

export enum routes {
  STUDENT_HOME = "/",
  INSTRUCTOR_HOME = "/instructor",
  LOGIN = "/login",
  PASSWORD_LOST = "/password-lost",
  PASSWORD_RESET = "/password-reset/:uid/:token/",
}

interface IRouteData {
  title: string;
  permissionTest?: (user: IUser | null) => boolean;
  props: RouteProps;
}

export const routesData: { [route: string]: IRouteData } = {};
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
  permissionTest: (user: IUser | null): boolean => !!user?.isStaff,
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
routesData[routes.PASSWORD_RESET] = {
  title: "Password reset",
  props: {
    path: routes.PASSWORD_RESET,
    exact: true,
    component: PasswordChange,
  },
};
routesData[routes.PASSWORD_LOST] = {
  title: "Lost password",
  props: {
    path: routes.PASSWORD_LOST,
    exact: true,
    component: PasswordLost
  }
};

export const navRoutes: string[] = [routes.INSTRUCTOR_HOME];
