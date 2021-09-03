import React from "react";
import {
  Exercise,
  ExerciseGroups,
  TopicContentExercises,
} from "../../../models/Exercise";
import { UserAnswerSummaryMap } from "../../../models/UserAnswerSummary";
import CodeExerciseResult from "../CodeExerciseResult";
import GroupResult from "../GroupResult";
import { CompletionRates } from "../service";
import TopicResult from "../TopicResult";

interface ResultColumnProps {
  data: Exercise | ExerciseGroups | TopicContentExercises | null;
  offering: number;
  summaryMap: UserAnswerSummaryMap;
  completionRates: CompletionRates;
}

const getComponent = (
  data: any,
  offering: number,
  summaryMap: UserAnswerSummaryMap,
  completionRates: CompletionRates,
): React.ReactNode => {
  if (!data) return null;

  // Is exercise
  if (data.slug)
    return (
      <CodeExerciseResult
        offering={offering}
        summaryMap={summaryMap}
        exercise={data}
      />
    );

  // Is exercise group
  const keys = Object.keys(data);
  if (keys && data[keys[0]]?.length)
    return <GroupResult group={data} completionRates={completionRates} />;

  // Is topic
  const keys2 = Object.keys(data[keys[0]]);
  if (keys && keys2 && data[keys[0]][keys2[0]]?.length)
    return <TopicResult topic={data} completionRates={completionRates} />;

  // I don't know what you are
  return null;
};

const ResultColumn = ({
  data,
  offering,
  summaryMap,
  completionRates,
}: ResultColumnProps) => {
  return <>{getComponent(data, offering, summaryMap, completionRates)}</>;
};

export default ResultColumn;
