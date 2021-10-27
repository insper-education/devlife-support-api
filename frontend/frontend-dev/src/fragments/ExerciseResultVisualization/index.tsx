import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExercisesProvider } from "../../contexts/ExercisesContext";
import { useExerciseContext } from "../../hooks/useExerciseContext";
import { IExerciseGroups } from "../../models/Exercise";
import Column from "./Column";
import { InstructorResultColumn } from "./InstructorResultVisualization";
import ResultColumn from "./ResultColumn";
import {
  ICompletionRates,
  extractCompletionRatesFromExerciseGroups,
  extractCompletionRatesFromExercises,
  extractCompletionRatesFromTopicContents,
} from "./service";

interface IExerciseResultVisualizationProps {
  className?: string;
  viewAsStaff?: boolean;
}

const ExerciseResultVisualization = ({
  className,
  viewAsStaff = false,
}: IExerciseResultVisualizationProps) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<string>("");
  const [contentGroup, setContentGroup] = useState<string>("");
  const { summaryMap, exerciseGroups, setSelectedData } = useExerciseContext();

  const [topicCompletionRates, setTopicCompletionRates] =
    useState<ICompletionRates>({});
  useEffect(() => {
    setTopicCompletionRates(
      extractCompletionRatesFromTopicContents(exerciseGroups, summaryMap),
    );
  }, [exerciseGroups, summaryMap]);

  const [contentGroups, setContentGroups] = useState<IExerciseGroups>({});
  const [groupCompletionRates, setGroupCompletionRates] =
    useState<ICompletionRates>({});
  useEffect(() => {
    const groups = topic ? exerciseGroups[topic] : {};
    setContentGroups(groups);
    if (groups)
      setGroupCompletionRates(
        extractCompletionRatesFromExerciseGroups(groups, summaryMap),
      );
  }, [topic, exerciseGroups, summaryMap]);

  const [exercises, setExercises] = useState<string[]>([]);
  const [exerciseCompletionRates, setExerciseCompletionRates] =
    useState<ICompletionRates>({});

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
    <>
      <div
        className={`grid grid-flow-row-dense grid-cols-1 lg:grid-cols-4 shadow-sm ${
          className ? className : ""
        }`}>
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
          className=" lg:col-start-3 lg:col-end-5"
          onSelect={handleSelectExercise}
          completionRates={exerciseCompletionRates}
          selectedRow={selectedExerciseRow}
        />
      </div>
      <div className="py-2">
        {viewAsStaff ? (
          <InstructorResultColumn offering={1} />
        ) : (
          <ResultColumn
            offering={1}
            completionRates={
              [
                topicCompletionRates,
                groupCompletionRates,
                exerciseCompletionRates,
              ][selectedLevel]
            }
          />
        )}
      </div>
    </>
  );
};

export default ExerciseResultVisualization;
