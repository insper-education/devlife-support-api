import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { useUser } from "../../contexts/user-context";
import HandoutProgress from "../../fragments/HandoutProgress";
import Header from "../../fragments/Header";
import { groupByURL, UrlExercises } from "../../models/Exercise";
import { useExerciseList } from "../../services/exercises";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [urlExerciseList, setUrlExerciseList] = useState<UrlExercises>({});

  const token = user?.token || "";
  const offering = 1;

  const { exerciseList } = useExerciseList(offering, token);

  useEffect(() => {
    setUrlExerciseList(groupByURL(exerciseList));
  }, [exerciseList]);

  if (!user) return null;

  return (
    <>
      <Header />
      <Container>
        <Title>{`${user.firstName} ${user?.lastName}`}</Title>
        {Object.keys(urlExerciseList).map((url: string) => (
          <HandoutProgress
            key={`handout-${url}`}
            offering={offering}
            user={user}
            url={url}
            exercises={urlExerciseList[url]}
          />
        ))}
      </Container>
    </>
  );
};

export default StudentHome;
