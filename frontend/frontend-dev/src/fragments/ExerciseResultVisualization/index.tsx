import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Exercise,
  ExerciseGroups,
  TopicContentExercises,
} from "../../models/Exercise";
import { UserAnswerSummaryMap } from "../../models/UserAnswerSummary";
import CodeExerciseResult from "./CodeExerciseResult";
import Column from "./Column";
import {
  CompletionRates,
  extractCompletionRatesFromExerciseGroups,
  extractCompletionRatesFromExercises,
  extractCompletionRatesFromTopicContents,
} from "./service";

interface ExerciseResultVisualizationProps {
  exerciseGroups: TopicContentExercises;
  summaryMap: UserAnswerSummaryMap;
  className?: string;
}

const ExerciseResultVisualization = ({
  exerciseGroups,
  summaryMap,
  className,
}: ExerciseResultVisualizationProps) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<string>("");
  const [contentGroup, setContentGroup] = useState<string>("");
  const [exercise, setExercise] = useState<Exercise | null>(null);

  const [
    topicCompletionRates,
    setTopicCompletionRates,
  ] = useState<CompletionRates>({});
  useEffect(() => {
    setTopicCompletionRates(
      extractCompletionRatesFromTopicContents(exerciseGroups, summaryMap),
    );
  }, [exerciseGroups, summaryMap]);

  const [contentGroups, setContentGroups] = useState<ExerciseGroups>({});
  const [
    groupCompletionRates,
    setGroupCompletionRates,
  ] = useState<CompletionRates>({});
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
  ] = useState<CompletionRates>({});
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

  const handleSelectExercise = (slug: string, idx: number) =>
    setExercise(contentGroups[contentGroup][idx]);

  return (
    <div className={`grid grid-cols-6 shadow-sm ${className ? className : ""}`}>
      <Column
        title={t("Topic")}
        options={Object.keys(exerciseGroups)}
        onSelect={setTopic}
        completionRates={topicCompletionRates}
      />
      <Column
        title={t("Content")}
        options={Object.keys(contentGroups)}
        onSelect={setContentGroup}
        completionRates={groupCompletionRates}
      />
      <Column
        title={t("Exercises")}
        options={exercises}
        onSelect={handleSelectExercise}
        completionRates={exerciseCompletionRates}
      />
      <div className="col-start-4 col-end-7 border border-gray-200 py-2">
        {exercise && (
          <CodeExerciseResult
            offering={1}
            title={exercise.slug}
            exercise={exercise}
            summary={summaryMap[exercise.pk]}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciseResultVisualization;
