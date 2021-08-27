import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import AdminRedirect from "../../components/Redirect/AdminRedirect";
import Title from "../../components/Title";
import Header from "../../fragments/Header";
import { useUser } from "../../contexts/user-context";
import axios from "axios";
import { Exercise } from "../../models/Exercise";
import ExerciseDetails from "../../fragments/ExerciseDetails";
import { getExerciseList } from "../../services/exercises";

const InstructorHome = () => {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const { t } = useTranslation();
  const { user } = useUser();

  const token = user?.token || "";
  const offering = 1;
  

  useEffect(() => {
      getExerciseList(offering, token)
      .then((data) => {
        setExerciseList(data);
      });
  }, []);

  return (
    <>
      <AdminRedirect />
      <Header />
      <Container>
        <Title>{t("Instructor Dashboard")}</Title>
        {exerciseList.map((item: Exercise) => (
          <ExerciseDetails
            key={`exercise-${item.slug}`}
            offering={offering}
            slug={item.slug}
          />
        ))}
      </Container>
    </>
  );
};

export default InstructorHome;
