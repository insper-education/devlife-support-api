import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import AdminRedirect from "../../components/Redirect/AdminRedirect";
import Title from "../../components/Title";
import Header from "../../fragments/Header";
import { useUser } from "../../contexts/user-context";
import axios from "axios";
import { Exercise } from "../../models/Exercise"
import ExerciseDetails from "../../fragments/ExerciseDetails";

const InstructorHome = (props: any) => {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const { t } = useTranslation();
  const { user } = useUser();

  const token = user?.token;
  const offering = 1;
  const EXERCISES_LIST_URL = `/api/offerings/${offering}/exercises/`;

  useEffect(() => {
    axios.get(EXERCISES_LIST_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data)
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
        { exerciseList.map( (item:Exercise, index:any) => 
          <ExerciseDetails key={`exercise-${index}`} offering={offering} slug={item.slug} />
        ) }
      </Container>
    </>
  );
};

export default InstructorHome;
