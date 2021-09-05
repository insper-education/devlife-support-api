import { Exercise } from "../../models/Exercise";
import { User } from "../../models/User";
import { UserAnswerSummary } from "../../models/UserAnswerSummary";
import { api } from "../api";
import { useGetRequest } from "../requests";

export const useExerciseList = (offering: number, token: string) => {
  const { data, error, loading } = useGetRequest<Exercise[]>(
    `/api/offerings/${offering}/exercises/`,
    [],
    token
  );
  return { exerciseList: data, error, loading };
};

export const getAnswerSummaryList = async (
  offering: number,
  slug: string
): Promise<UserAnswerSummary[]> => {
  const ANSWERS_SUMMARIES_URL = `/api/offerings/${offering}/exercises/${slug}/summaries/`;

  const res = await api.get(ANSWERS_SUMMARIES_URL);
  return res.data;
};

export const getAnswerSummary = async (
  offering: number,
  slug: string,
  user: User
): Promise<UserAnswerSummary> => {
  const ANSWERS_SUMMARY_URL = `/api/offerings/${offering}/exercises/${slug}/summaries/${user.pk}`;

  const res = await api.get(ANSWERS_SUMMARY_URL);
  return res.data;
};
