import { useContext } from "react";
import { ExerciseContext } from "../contexts/ExercisesContext";

export function useExerciseContext() {
  const {
    exerciseList,
    selectedData,
    summaryMap,
    summaryList,
    exerciseGroups,
    setSelectedData,
  } = useContext(ExerciseContext);

  return {
    exerciseList,
    selectedData,
    summaryMap,
    summaryList,
    exerciseGroups,
    setSelectedData,
  };
}
