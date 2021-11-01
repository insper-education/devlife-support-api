import React from "react";
import { useExerciseContext } from "../../../hooks/useExerciseContext";
import {
  IExercise,
  IExerciseGroups,
  ITopicContentExercises,
} from "../../../models/Exercise";
import { IUserAnswerSummaryMap } from "../../../models/UserAnswerSummary";
import CodeExerciseResult from "../CodeExerciseResult";
import GroupResult from "../GroupResult";
import { ICompletionRates } from "../service";
import TopicResult from "../TopicResult";

interface IResultColumnProps {
  offering: number;
  completionRates: ICompletionRates;
}

const getComponent = (
  data: any,
  offering: number,
  summaryMap: IUserAnswerSummaryMap,
  completionRates: ICompletionRates,
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

const ResultColumn = ({ offering, completionRates }: IResultColumnProps) => {
  const { summaryMap, selectedData } = useExerciseContext();
  return (
    <>{getComponent(selectedData, offering, summaryMap, completionRates)}</>
  );
};

export default ResultColumn;
