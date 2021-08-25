import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/user-context";
import { routes } from "../../routes";
import Button from "../Button";

const UserMenu = () => {
  const { t } = useTranslation();
  const { user, removeUser: logout } = useUser();

  return (
    <>
      {!user && <Link to={routes.LOGIN}>{t("Login")}</Link>}
      {!!user && (
        <Button variant="hidden" onClick={logout}>
          {t("Logout")}
        </Button>
      )}
    </>
  );
};

export default UserMenu;
