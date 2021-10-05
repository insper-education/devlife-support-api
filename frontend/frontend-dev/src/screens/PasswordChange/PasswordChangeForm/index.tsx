import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../../components/Form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import { schema, PasswordChangeInputs } from "../password-change-schema";
import { resetPassword } from "../../../services/auth";
import ErrorMessage from "../../../components/Form/ErrorMessage";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { useHistory } from "react-router";

interface IPasswordChangeForm {
  firstTime: boolean;
  uid?: string;
  token?: string;
  reason?: string | null;
}

const PasswordChangeForm = ({
  firstTime,
  uid,
  token,
  reason,
}: IPasswordChangeForm) => {
  const history = useHistory();

  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeInputs>({
    resolver: yupResolver(schema),
  });

  const [invalidLink, setInvalidLink] = useState<boolean>(false);
  const onSubmit = (data: PasswordChangeInputs) => {
    setLoading(true);
    resetPassword(
      uid || "",
      token || "",
      data.password,
      data.passwordConfirmation,
    )
      .then((success) => {
        if (success) history.push("/");
        else setInvalidLink(true);
      })
      .finally(() => mounted.current && setLoading(false));
  };

  const { onChange: onPasswordChange, ...passwordInputProps } =
    register("password");

  const {
    onChange: onPasswordConfirmationChange,
    ...passwordConfirmationInputProps
  } = register("passwordConfirmation");

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.TextInput
          label={t("Password")}
          inputId="password"
          type="password"
          placeholder={t("Password")}
          {...passwordInputProps}
          onChange={onPasswordChange}
          error={t(errors?.password?.message || "")}
        />
        <Form.TextInput
          label={t("Repeat password")}
          inputId="passwordConfirmation"
          type="password"
          placeholder={t("Password")}
          {...passwordConfirmationInputProps}
          onChange={onPasswordConfirmationChange}
          error={t(errors?.passwordConfirmation?.message || "")}
        />
        {!!reason && <ErrorMessage>{t(reason || "")}</ErrorMessage>}
        {invalidLink && (
          <ErrorMessage>{t("Invalid password reset link")}</ErrorMessage>
        )}
        <Button
          variant="secondary"
          className="mt-2 w-full"
          type="submit"
          disabled={loading}>
          {firstTime ? t("Set password") : t("Reset password")}
        </Button>
        {loading && (
          <div className="w-full flex justify-center">
            <LoadingIndicator className="text-xs" />
          </div>
        )}
      </Form>
    </>
  );
};

export default PasswordChangeForm;
