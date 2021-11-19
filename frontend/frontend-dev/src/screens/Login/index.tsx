import React, { useEffect, useMemo } from "react";
import { useUser } from "../../contexts/user-context";
import { useHistory } from "react-router";
import useQuery from "../../hooks/useQuery";
import LoginForm from "./LoginForm";
import SignInContainer from "../../fragments/SignInContainer";
import RedirectingPage from "./RedirectingPage";

const Login = () => {
  const { user, removeUser } = useUser();
  const history = useHistory();
  const params = useQuery();
  const redirectTo = params.get("redirectTo");
  const decodedRedirectTo = useMemo(
    () => redirectTo && decodeURIComponent(redirectTo),
    [redirectTo],
  );

  useEffect(() => {
    if (!user) return;
    if (params.get("reason")) removeUser();
    else if (decodedRedirectTo) {
      let newHref = decodedRedirectTo;
      newHref += `${newHref.indexOf("?") >= 0 ? "&" : "?"}token=${user.token}`;
      window.location.href = newHref;
    } else {
      history.replace(params.get("next") || "/");
    }
  }, [history, params, user, removeUser, decodedRedirectTo]);

  if (user?.token && decodedRedirectTo) {
    return <RedirectingPage redirectTo={decodedRedirectTo} />;
  } else {
    return (
      <SignInContainer>
        <LoginForm />
      </SignInContainer>
    );
  }
};

export default Login;
