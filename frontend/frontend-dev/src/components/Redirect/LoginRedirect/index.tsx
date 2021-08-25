import React from "react";
import { Redirect, useLocation } from "react-router";
import { useUser } from "../../../contexts/user-context";
import { routes } from "../../../routes";

const LoginRedirect = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user && location.pathname !== routes.LOGIN)
    return (
      <Redirect
        to={{ pathname: routes.LOGIN, search: `?next=${location.pathname}` }}
      />
    );
  return null;
};

export default LoginRedirect;
