import {
  IExercise,
  IExerciseGroups,
  ITopicContentExercises,
} from "../../../models/Exercise";
import { IUserAnswerSummaryMap } from "../../../models/UserAnswerSummary";

export interface ICompletionRates {
  [name: string]: number;
}

export const extractCompletionRatesFromExercises = (
  exercises: IExercise[],
  answerSummaries: IUserAnswerSummaryMap,
): ICompletionRates => {
  return Object.fromEntries(
    exercises.map((exercise) => {
      const summary = answerSummaries[exercise.pk];
      return [exercise.slug, summary ? summary.max_points : 0];
    }),
  );
};

export const extractCompletionRatesFromExerciseGroups = (
  exercises: IExerciseGroups,
  answerSummaries: IUserAnswerSummaryMap,
): ICompletionRates => {
  return Object.fromEntries(
    Object.keys(exercises).map((name) => {
      const rates = Object.values(
        extractCompletionRatesFromExercises(exercises[name], answerSummaries),
      );
      return [name, rates.reduce((a, b) => a + b, 0) / rates.length];
    }),
  );
};

export const extractCompletionRatesFromTopicContents = (
  exercises: ITopicContentExercises,
  answerSummaries: IUserAnswerSummaryMap,
): ICompletionRates => {
  return Object.assign(
    {},
    ...Object.keys(exercises).map((name) => {
      const contentGroups = exercises[name];
      const allExercises = Object.keys(contentGroups)
        .map((groupName) => contentGroups[groupName])
        .reduce((a, b) => {
          if (!a && !b) return [];
          if (!a) return b;
          if (!b) return a;
          return a.concat(b);
        }, []);
      return extractCompletionRatesFromExerciseGroups(
        { [name]: allExercises },
        answerSummaries,
      );
    }),
  );
};
