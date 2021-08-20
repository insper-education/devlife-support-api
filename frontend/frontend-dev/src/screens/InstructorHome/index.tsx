import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import Title from "../../components/Title";
import Header from "../../fragments/Header";

const InstructorHome = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <Container>
        <Title>{t("Instructor Dashboard")}</Title>
      </Container>
    </>
  );
};

export default InstructorHome;
