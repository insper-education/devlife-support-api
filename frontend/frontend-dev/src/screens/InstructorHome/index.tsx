import React from "react";
import { useTranslation } from "react-i18next";

const InstructorHome = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("Instructor Dashboard")}</h1>
    </>
  );
};

export default InstructorHome;
