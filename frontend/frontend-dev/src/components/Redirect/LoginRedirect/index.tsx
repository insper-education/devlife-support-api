import React from "react";
import { matchPath, Redirect, useLocation } from "react-router";
import { useUser } from "../../../contexts/user-context";
import { routes, routesData } from "../../../routes";

const LoginRedirect = () => {
  const { user } = useUser();
  const location = useLocation();

  if (
    !user &&
    !matchPath(location.pathname, routesData[routes.LOGIN].props) &&
    !matchPath(location.pathname, routesData[routes.PASSWORD_RESET].props)
  )
    return (
      <Redirect
        to={{ pathname: routes.LOGIN, search: `?next=${location.pathname}` }}
      />
    );
  return null;
};

export default LoginRedirect;
