import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IExercise,
  IExerciseGroups,
  ITopicContentExercises,
} from "../../models/Exercise";
import { IUserAnswerSummaryMap } from "../../models/UserAnswerSummary";
import Column from "./Column";
import ResultColumn from "./ResultColumn";
import {
  ICompletionRates,
  extractCompletionRatesFromExerciseGroups,
  extractCompletionRatesFromExercises,
  extractCompletionRatesFromTopicContents,
} from "./service";

interface IExerciseResultVisualizationProps {
  exerciseGroups: ITopicContentExercises;
  summaryMap: IUserAnswerSummaryMap;
  className?: string;
}

const ExerciseResultVisualization = ({
  exerciseGroups,
  summaryMap,
  className,
}: IExerciseResultVisualizationProps) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<string>("");
  const [contentGroup, setContentGroup] = useState<string>("");

  const [
    topicCompletionRates,
    setTopicCompletionRates,
  ] = useState<ICompletionRates>({});
  useEffect(() => {
    setTopicCompletionRates(
      extractCompletionRatesFromTopicContents(exerciseGroups, summaryMap),
    );
  }, [exerciseGroups, summaryMap]);

  const [contentGroups, setContentGroups] = useState<IExerciseGroups>({});
  const [
    groupCompletionRates,
    setGroupCompletionRates,
  ] = useState<ICompletionRates>({});
  useEffect(() => {
    const groups = topic ? exerciseGroups[topic] : {};
    setContentGroups(groups);
    if (groups)
      setGroupCompletionRates(
        extractCompletionRatesFromExerciseGroups(groups, summaryMap),
      );
  }, [topic, exerciseGroups, summaryMap]);

  const [exercises, setExercises] = useState<string[]>([]);
  const [
    exerciseCompletionRates,
    setExerciseCompletionRates,
  ] = useState<ICompletionRates>({});
  useEffect(() => {
    const exerciseList = contentGroups[contentGroup];
    setExercises(
      Object.keys(contentGroups) && contentGroup
        ? exerciseList.map((exercise) => exercise.slug)
        : [],
    );
    if (exerciseList)
      setExerciseCompletionRates(
        extractCompletionRatesFromExercises(exerciseList, summaryMap),
      );
  }, [contentGroups, contentGroup, summaryMap]);

  const [selectedTopicRow, setSelectedTopicRow] = useState<number>(-1);
  const [selectedGroupRow, setSelectedGroupRow] = useState<number>(-1);
  const [selectedExerciseRow, setSelectedExerciseRow] = useState<number>(-1);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<
    IExercise | IExerciseGroups | ITopicContentExercises | null
  >(null);
  const handleSelectTopic = (topic: string, idx: number) => {
    setTopic(topic);
    setSelectedData({ [topic]: exerciseGroups[topic] });
    setContentGroup("");
    setSelectedTopicRow(idx);
    setSelectedGroupRow(-1);
    setSelectedExerciseRow(-1);
    setSelectedLevel(0);
  };
  const handleSelectGroup = (group: string, idx: number) => {
    setContentGroup(group);
    setSelectedData({ [group]: contentGroups[group] });
    setSelectedGroupRow(idx);
    setSelectedExerciseRow(-1);
    setSelectedLevel(1);
  };
  const handleSelectExercise = (slug: string, idx: number) => {
    const exercise = contentGroups[contentGroup][idx];
    setSelectedData(exercise);
    setSelectedExerciseRow(idx);
    setSelectedLevel(2);
  };

  return (
    <div className={`grid grid-cols-6 shadow-sm ${className ? className : ""}`}>
      <Column
        title={t("Topic")}
        options={Object.keys(exerciseGroups)}
        onSelect={handleSelectTopic}
        completionRates={topicCompletionRates}
        selectedRow={selectedTopicRow}
      />
      <Column
        title={t("Content")}
        options={Object.keys(contentGroups)}
        onSelect={handleSelectGroup}
        completionRates={groupCompletionRates}
        selectedRow={selectedGroupRow}
      />
      <Column
        title={t("Exercises")}
        options={exercises}
        onSelect={handleSelectExercise}
        completionRates={exerciseCompletionRates}
        selectedRow={selectedExerciseRow}
      />
      <div className="col-start-4 col-end-7 border border-gray-200 py-2">
        <ResultColumn
          offering={1}
          data={selectedData}
          summaryMap={summaryMap}
          completionRates={
            [
              topicCompletionRates,
              groupCompletionRates,
              exerciseCompletionRates,
            ][selectedLevel]
          }
        />
      </div>
    </div>
  );
};

export default ExerciseResultVisualization;
