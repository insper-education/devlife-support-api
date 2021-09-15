import { dynamicPathname } from "../../helpers";
import { Answer } from "../../models/Answer";
import { Exercise } from "../../models/Exercise";
import { UserAnswerSummary } from "../../models/UserAnswerSummary";
import { useGetRequest } from "../requests";
import {
  EXERCISE_ANSWER,
  EXERCISE_SUMMARY,
  LIST_EXERCISES,
  LIST_EXERCISES_SUMMARIES
} from "../routes";

export const useExerciseList = (offering: number, token: string) => {
  const { data, error, loading, refresh } = useGetRequest<Exercise[]>(
    dynamicPathname(LIST_EXERCISES, { offering: String(offering) }),
    [],
    token
  );
  return { exerciseList: data, error, loading, refresh };
};

export const useAnswer = (
  offering: number,
  token: string,
  exerciseSlug: string,
  answerId: number
) => {
  const { data, error, loading, refresh } = useGetRequest<Answer | null>(
    dynamicPathname(EXERCISE_ANSWER, { offering, exerciseSlug, answerId }),
    null,
    token,
    !(exerciseSlug && token && answerId !== undefined && offering !== undefined)
  );
  return { answer: data, error, loading, refresh };
};

export const useSummaryList = (
  offering: number,
  token: string,
  user?: number
) => {
  const query = user ? `?user=${user}` : "";
  const { data, error, loading, refresh } = useGetRequest<UserAnswerSummary[]>(
    `${dynamicPathname(LIST_EXERCISES_SUMMARIES, { offering })}${query}`,
    [],
    token
  );
  return { summaryList: data, error, loading, refresh };
};

export const useSummaryListForExercise = (
  offering: number,
  exerciseSlug: string,
  token: string,
  user?: number
) => {
  const query = user ? `?user=${user}` : "";
  const { data, error, loading, refresh } = useGetRequest<UserAnswerSummary[]>(
    `${dynamicPathname(EXERCISE_SUMMARY, {
      offering,
      exerciseSlug
    })}${query}`,
    [],
    token
  );
  return { summaryList: data, error, loading, refresh };
};
