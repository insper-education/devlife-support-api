import React from "react";
import { Redirect, useLocation } from "react-router";
import { useUser } from "../../../contexts/user-context";
import { routes } from "../../../routes";

const AdminRedirect = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!!user && !user.isStaff)
    return (
      <Redirect
        to={{
          pathname: routes.LOGIN,
          search: `?next=${location.pathname}&reason=not-admin`,
        }}
      />
    );
  return null;
};

export default AdminRedirect;
