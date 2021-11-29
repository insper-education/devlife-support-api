import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Title from "../../../components/Title";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import { PASSWORD_LOST_PATH } from "../../../services/routes";
import { IPasswordResetInputs, passwordResetSchema } from "../schema";

const PasswordLostForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasswordResetInputs>({
    resolver: yupResolver(passwordResetSchema),
  });

  const { onChange: onEmailChange, ...emailInputProps } = register("email");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e);
  };

  const onSubmit = (data: IPasswordResetInputs) => {
    setLoading(true);
    axios
      .post(
        PASSWORD_LOST_PATH,
        {
          email: data.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => { })
      .catch((resp) => { })
      .finally(() => {
        setFinished(true);
      });
  };

  return (
    <>
      {!finished && (
        <>
          <Title variant={5} className="mb-4">{t("Lost password")}</Title>
          {t('lost password message')}
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <Form.TextInput
              placeholder={t("Type email")}
              inputId="email"
              onChange={handleEmailChange}
              disabled={loading}
              {...emailInputProps}
            />
            <Button
              variant="secondary"
              className="mt-2 w-full"
              type="submit"
              disabled={loading}>
              {t("Reset password")}
            </Button>
          </Form>
        </>
      )}

      {finished && (
        <p>
          Caso este email esteja cadastrado no sistema, será enviado um email
          com um link para resetar a senha.
        </p>
      )}
    </>
  );
};

export default PasswordLostForm;
