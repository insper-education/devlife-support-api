import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../components/Form";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import { schema, LoginInputs } from "./login-schema";
import { login } from "../../services/auth";
import { useUser } from "../../contexts/user-context";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { useHistory } from "react-router";

const Login = () => {
  const [invalidLogin, setInvalidLogin] = useState<boolean>(false);
  const { t } = useTranslation();
  const { putUser } = useUser();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginInputs) => {
    login(data.username, data.password).then((user) => {
      if (!user) setInvalidLogin(true);
      else {
        putUser(user);
        history.replace("/");
      }
    });
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
    <div className="w-full px-2">
      <div className="max-w-xs mx-auto rounded shadow">
        <h1 className="text-xl uppercase px-4 py-4 bg-primary text-white rounded-t text-center">
          {t("Developer Life")}
        </h1>
        <Form className="px-4 py-4" onSubmit={handleSubmit(onSubmit)}>
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
          <Button className="mt-2" type="submit">
            {t("Sign in")}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
