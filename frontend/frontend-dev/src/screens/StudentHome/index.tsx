import React from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../contexts/user-context";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  return (
    <>
      <h1>{t("Student Dashboard")}</h1>
      {user?.firstName}
    </>
  );
};

export default StudentHome;
