import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../../components/Form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import { schema, ILoginInputs } from "../login-schema";
import { login } from "../../../services/auth";
import ErrorMessage from "../../../components/Form/ErrorMessage";
import LoadingIndicator from "../../../components/LoadingIndicator";
import Separator from "../../../components/Separator";
import { useUser } from "../../../contexts/user-context";
import useQuery from "../../../hooks/useQuery";

const LoginForm = () => {
  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const params = useQuery();
  const reason = params.get("reason");

  const [invalidLogin, setInvalidLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { putUser } = useUser();

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
        if (!mounted.current) return;
        if (!user) setInvalidLogin(true);
        else {
          putUser(user);
        }
      })
      .finally(() => mounted.current && setLoading(false));
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
    <>
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
        {!!reason && <ErrorMessage>{t(reason || "")}</ErrorMessage>}
        <Button
          variant="secondary"
          className="mt-2 w-full"
          type="submit"
          disabled={loading}>
          {t("Sign in")}
        </Button>
        {loading && (
          <div className="w-full flex justify-center">
            <LoadingIndicator className="text-xs" />
          </div>
        )}
      </Form>
      <Separator>{t("or")}</Separator>
      <p>{t("Ask the instructor to sign you up")}</p>
    </>
  );
};

export default LoginForm;
