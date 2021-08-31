import { Exercise } from "../../models/Exercise";
import axios from "axios";
import { UserAnswerSummary } from "../../models/UserAnswerSummary";
import { User } from "../../models/User";
import { useGetRequest } from "../requests";

export const useExerciseList = (offering: number, token: string) => {
  const { data, error, loading } = useGetRequest<Exercise[]>(
    `/api/offerings/${offering}/exercises/`,
    [],
    token,
  );
  return { exerciseList: data, error, loading };
};

export const getAnswerSummaryList = (
  offering: number,
  slug: string,
  token: string,
): Promise<UserAnswerSummary[]> => {
  const ANSWERS_SUMMARIES_URL = `/api/offerings/${offering}/exercises/${slug}/summaries/`;

  return axios
    .get(ANSWERS_SUMMARIES_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getAnswerSummary = (
  offering: number,
  slug: string,
  user: User,
): Promise<UserAnswerSummary> => {
  const ANSWERS_SUMMARY_URL = `/api/offerings/${offering}/exercises/${slug}/summaries/${user.pk}`;

  return axios
    .get(ANSWERS_SUMMARY_URL, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })
    .then((res) => res.data);
};
