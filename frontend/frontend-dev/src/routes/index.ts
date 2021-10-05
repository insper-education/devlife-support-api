import { RouteProps } from "react-router";
import { IUser } from "../models/User";
import ExerciseAnswers from "../screens/ExerciseAnswers";
import InstructorHome from "../screens/InstructorHome";
import Login from "../screens/Login";
import PasswordChange from "../screens/PasswordChange";
import StudentHome from "../screens/StudentHome";

export enum routes {
  STUDENT_HOME = "/",
  INSTRUCTOR_HOME = "/instructor",
  EXERCISE_ANSWERS = "/instructor/answers/:offering/:slug/",
  LOGIN = "/login",
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
routesData[routes.EXERCISE_ANSWERS] = {
  title: "Exercise Answers",
  permissionTest: (user: IUser | null): boolean => !!user?.isStaff,
  props: {
    path: routes.EXERCISE_ANSWERS,
    exact: true,
    component: ExerciseAnswers,
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

export const navRoutes: string[] = [routes.INSTRUCTOR_HOME];
