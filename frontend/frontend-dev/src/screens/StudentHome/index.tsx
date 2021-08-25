import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { useUser } from "../../contexts/user-context";
import Header from "../../fragments/Header";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  return (
    <>
      <Header />
      <Container>
        <Title>{t("Student Dashboard")}</Title>
        {user?.firstName} {user?.isStaff ? "STAFF" : "NOT STAFF"}
      </Container>
    </>
  );
};

export default StudentHome;
