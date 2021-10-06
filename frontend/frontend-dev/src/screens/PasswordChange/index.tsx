import React from "react";
import { matchPath, useLocation } from "react-router";
import useQuery from "../../hooks/useQuery";
import PasswordChangeForm from "./PasswordChangeForm";
import SignInContainer from "../../fragments/SignInContainer";
import { routes, routesData } from "../../routes";

const PasswordChange = () => {
  const params = useQuery();
  const firstTime = params.get("first");
  const location = useLocation();
  const pathParams = matchPath(
    location.pathname,
    routesData[routes.PASSWORD_RESET].props,
  )?.params as { uid: string; token: string };

  return (
    <>
      <SignInContainer>
        <PasswordChangeForm
          firstTime={!!firstTime}
          uid={pathParams?.uid}
          token={pathParams?.token}
          reason={params.get("reason")}
        />
      </SignInContainer>
    </>
  );
};

export default PasswordChange;
