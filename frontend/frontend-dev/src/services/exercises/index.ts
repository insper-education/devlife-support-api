import { Exercise } from "../../models/Exercise";
import { Answer } from "../../models/Answer";
import axios from "axios";

export const getExerciseList = (
  offering: number,
  token: string
): Promise<Exercise[]> => {
  const EXERCISES_LIST_URL = `/api/offerings/${offering}/exercises/`;

  return axios
    .get(EXERCISES_LIST_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getExerciseAnswerList = (
  offering: number,
  slug: string,
  token: string
): Promise<Answer[]> => {
  const EXERCISE_ANSWERS_URL = `/api/offerings/${offering}/exercises/${slug}/answers/`;

  return axios
    .get(EXERCISE_ANSWERS_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => res.data);
};
