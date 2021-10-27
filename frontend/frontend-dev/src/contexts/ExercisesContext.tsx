import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ICompletionRates } from "../fragments/ExerciseResultVisualization/service";
import {
  groupByTopicAndContent,
  IExercise,
  IExerciseGroups,
  ITopicContentExercises,
} from "../models/Exercise";
import { IUser } from "../models/User";
import {
  IUserAnswerSummary,
  IUserAnswerSummaryMap,
  summaryListToMap,
} from "../models/UserAnswerSummary";

import { useExerciseList, useSummaryList } from "../services/exercises";
import { useUser } from "./user-context";

interface IExerciseProviderData {
  selectedData: IExercise | IExerciseGroups | ITopicContentExercises | null;
  summaryMap: IUserAnswerSummaryMap;
  summaryList: IUserAnswerSummary[];
  exerciseList: IExercise[];
  exerciseGroups: ITopicContentExercises;
  setSelectedData: Dispatch<
    SetStateAction<IExercise | IExerciseGroups | ITopicContentExercises | null>
  >;
}

export const ExerciseContext = createContext<IExerciseProviderData>(
  {} as IExerciseProviderData,
);

export function ExercisesProvider({ children }: { children: ReactNode }) {
  const [selectedData, setSelectedData] = useState<
    IExercise | IExerciseGroups | ITopicContentExercises | null
  >(null);

  const { user } = useUser();

  const [exerciseGroups, setExerciseGroups] = useState<ITopicContentExercises>(
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
  const [summaryMap, setSummaryMap] = useState<IUserAnswerSummaryMap>({});

  useEffect(() => {
    if (loadingSummaryList) return;
    setSummaryMap(summaryListToMap(summaryList));
  }, [summaryList, loadingSummaryList]);

  return (
    <ExerciseContext.Provider
      value={{
        selectedData,
        summaryMap,
        summaryList,
        exerciseList,
        exerciseGroups,
        setSelectedData,
      }}>
      {children}
    </ExerciseContext.Provider>
  );
}
