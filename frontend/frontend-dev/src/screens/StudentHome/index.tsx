import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import SubTitle from "../../components/SubTitle";
import Title from "../../components/Title";
import { useUser } from "../../contexts/user-context";
import ExerciseResultVisualization from "../../fragments/ExerciseResultVisualization";
import Header from "../../fragments/Header";
import {
  groupByTopicAndContent,
  TopicContentExercises,
} from "../../models/Exercise";
import {
  summaryListToMap,
  UserAnswerSummary,
  UserAnswerSummaryMap,
} from "../../models/UserAnswerSummary";
import { useExerciseList, useSummaryList } from "../../services/exercises";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [exerciseGroups, setExerciseGroups] = useState<TopicContentExercises>(
    {},
  );

  const token = user?.token || "";
  const offering = 1;

  const { exerciseList } = useExerciseList(offering, token);
  useEffect(() => {
    setExerciseGroups(groupByTopicAndContent(exerciseList));
  }, [exerciseList]);

  const { summaryList, loading: loadingSummaryList } = useSummaryList(
    offering,
    token,
    user?.pk,
  );
  const [summaryMap, setSummaryMap] = useState<UserAnswerSummaryMap>({});
  useEffect(() => {
    if (loadingSummaryList) return;
    setSummaryMap(summaryListToMap(summaryList));
  }, [summaryList, loadingSummaryList]);

  if (!user) return null;

  return (
    <>
      <Header />
      <Container>
        <Title>{t("Dashboard")}</Title>
        <SubTitle>{`${user.firstName} ${user?.lastName}`}</SubTitle>

        <section className="my-8">
          <Title variant={2}>{t("Exercises")}</Title>
          <ExerciseResultVisualization
            exerciseGroups={exerciseGroups}
            summaryMap={summaryMap}
            className="mt-4"
          />
        </section>
      </Container>
    </>
  );
};

export default StudentHome;
