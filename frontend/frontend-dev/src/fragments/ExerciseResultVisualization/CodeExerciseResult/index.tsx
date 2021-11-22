import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import { useUser } from "../../../contexts/user-context";
import { getName, IExercise } from "../../../models/Exercise";
import { IUserAnswerSummaryMap } from "../../../models/UserAnswerSummary";
import { useAnswer } from "../../../services/exercises";
import { IAnswer } from "../../../models/Answer";
import { CodeVisualizer } from "../../../components/CodeVisualizer";

interface ICodeExerciseResultProps {
  offering: number;
  summaryMap: IUserAnswerSummaryMap;
  exercise: IExercise;
}

const CodeExerciseResult = ({
  offering,
  summaryMap,
  exercise,
}: ICodeExerciseResultProps) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const summary = summaryMap[exercise?.pk];
  const { answer } = useAnswer(
    offering,
    user?.token || "",
    exercise?.slug,
    summary?.latest,
  );
  return (
    <>
      <Title variant={5} className="px-4 mt-2">
        {getName(exercise)}
      </Title>
      <div className="px-4 mt-4 max-w-full">
        <Button className="uppercase tracking-wide">Ver Exercício</Button>
        <section className="mt-6">
          <Title variant={5}>{t("Results")}</Title>
          <div className="flex flex-wrap mt-2">
            <span className="mr-8">
              {t("Max points")}:{" "}
              <strong className="font-bold text-primary-500">
                {Math.round((summary?.max_points || 0) * 10000) / 100}%
              </strong>
            </span>
            <span className="mr-8">
              {t("Attempts")}:{" "}
              <strong className="font-bold">
                {summary?.answer_count || 0}
              </strong>
            </span>
          </div>
        </section>
        {exercise.type === "CODE" && (
          <section className="mt-6">
            <h6 className="font-bold">{t("Last attempt")}</h6>
            <div className="flex flex-wrap mt-2">
              <span className="mr-8">
                {t("Tests passing")}:{" "}
                <strong className="font-bold">
                  {answer && answer.test_results
                    ? answer.test_results?.passed
                    : "0"}
                </strong>
              </span>
            </div>
            {answer?.student_input?.code && (
              <div className="mt-4">
                <strong className="font-bold">{t("Your solution")}:</strong>
                <div className="text-white mt-2 box-border rounded overflow-auto no-scrollbar">
                  <CodeVisualizer>{answer.student_input.code}</CodeVisualizer>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default CodeExerciseResult;
