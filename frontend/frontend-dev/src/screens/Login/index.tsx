import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../components/Form";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import { schema, ILoginInputs } from "./login-schema";
import { login } from "../../services/auth";
import { useUser } from "../../contexts/user-context";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { useHistory } from "react-router";
import LoadingIndicator from "../../components/LoadingIndicator";
import useQuery from "../../hooks/useQuery";
import Separator from "../../components/Separator";

const Login = () => {
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  const [invalidLogin, setInvalidLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { user, putUser } = useUser();
  const history = useHistory();
  const params = useQuery();
  let redirectTo = params.get("redirectTo");

  useEffect(() => {
    if (user && redirectTo) {
      redirectTo = decodeURIComponent(redirectTo);
      redirectTo += `${redirectTo.indexOf("?") >= 0 ? "&" : "?"}token=${
        user.token
      }`;
      window.location.href = redirectTo;
    }
  }, [user, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: ILoginInputs) => {
    setLoading(true);
    login(data.username, data.password)
      .then((user) => {
        if (unmounted.current) return;
        if (!user) setInvalidLogin(true);
        else {
          putUser(user);
          if (!redirectTo) {
            history.replace(params.get("next") || "/");
          }
        }
      })
      .finally(() => !unmounted.current && setLoading(false));
  };

  const { onChange: onUsernameChange, ...usernameInputProps } =
    register("username");
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidLogin(false);
    onUsernameChange(e);
  };

  const { onChange: onPasswordChange, ...passwordInputProps } =
    register("password");
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidLogin(false);
    onPasswordChange(e);
  };

  return (
    <div className="w-full min-h-screen px-2 flex flex-col lg:flex-row justify-center lg:justify-center items-center bg-gray-100">
      <div className="hidden md:block mb-8 lg:pr-24">
        <h1 className="text-8xl text-primary mb-4">Developer Life</h1>
        <img src="/img/insper.png" className="h-16" />
      </div>
      <div className="max-w-xs rounded shadow">
        <h2 className="text-3xl uppercase px-6 py-4 bg-primary text-white rounded-t text-center md:hidden">
          {t("Developer Life")}
        </h2>
        <div className="bg-white px-4 py-4 md:px-6 md:py-6 rounded">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.TextInput
              label={t("Username")}
              inputId="username"
              placeholder={t("Type username")}
              {...usernameInputProps}
              onChange={handleUsernameChange}
              error={t(errors?.username?.message || "")}
            />
            <Form.TextInput
              label={t("Password")}
              inputId="password"
              type="password"
              placeholder={t("Password")}
              {...passwordInputProps}
              onChange={handlePasswordChange}
              error={t(errors?.password?.message || "")}
            />
            {invalidLogin && (
              <ErrorMessage>{t("Invalid credentials")}</ErrorMessage>
            )}
            {!!params.get("reason") && (
              <ErrorMessage>{t(params.get("reason") || "")}</ErrorMessage>
            )}
            <Button className="mt-2 w-full" type="submit" disabled={loading}>
              {t("Sign in")}
            </Button>
            {loading && (
              <div className="w-full flex justify-center">
                <LoadingIndicator className="text-xs" />
              </div>
            )}
          </Form>
          <Separator>OU</Separator>
          <Button
            variant="secondary"
            className="mt-2 w-full"
            type="submit"
            disabled={loading}>
            {t("Sign up")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
