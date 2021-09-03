import { Exercise } from "../../models/Exercise";
import { useGetRequest } from "../requests";
import { UserAnswerSummary } from "../../models/UserAnswerSummary";
import { Answer } from "../../models/Answer";

export const useExerciseList = (offering: number, token: string) => {
  const { data, error, loading, refresh } = useGetRequest<Exercise[]>(
    `/api/offerings/${offering}/exercises/`,
    [],
    token,
  );
  return { exerciseList: data, error, loading, refresh };
};

export const useAnswer = (
  offering: number,
  token: string,
  exerciseSlug: string,
  answerId: number,
) => {
  const { data, error, loading, refresh } = useGetRequest<Answer | null>(
    `/api/offerings/${offering}/exercises/${exerciseSlug}/answers/${answerId}/`,
    null,
    token,
    !(
      exerciseSlug &&
      token &&
      answerId !== undefined &&
      offering !== undefined
    ),
  );
  return { answer: data, error, loading, refresh };
};

export const useSummaryList = (
  offering: number,
  token: string,
  user?: number,
) => {
  const query = user ? `?user=${user}` : "";
  const { data, error, loading, refresh } = useGetRequest<UserAnswerSummary[]>(
    `/api/offerings/${offering}/summaries/${query}`,
    [],
    token,
  );
  return { summaryList: data, error, loading, refresh };
};

export const useSummaryListForExercise = (
  offering: number,
  exerciseSlug: string,
  token: string,
  user?: number,
) => {
  const query = user ? `?user=${user}` : "";
  const { data, error, loading, refresh } = useGetRequest<UserAnswerSummary[]>(
    `/api/offerings/${offering}/summaries/${exerciseSlug}/${query}`,
    [],
    token,
  );
  return { summaryList: data, error, loading, refresh };
};
