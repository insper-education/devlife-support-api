import {
  Exercise,
  ExerciseGroups,
  TopicContentExercises,
} from "../../../models/Exercise";
import { UserAnswerSummaryMap } from "../../../models/UserAnswerSummary";

export interface CompletionRates {
  [name: string]: number;
}

export const extractCompletionRatesFromExercises = (
  exercises: Exercise[],
  answerSummaries: UserAnswerSummaryMap,
): CompletionRates => {
  return Object.fromEntries(
    exercises.map((exercise) => {
      const summary = answerSummaries[exercise.pk];
      return [exercise.slug, summary ? summary.max_points : 0];
    }),
  );
};

export const extractCompletionRatesFromExerciseGroups = (
  exercises: ExerciseGroups,
  answerSummaries: UserAnswerSummaryMap,
): CompletionRates => {
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
  exercises: TopicContentExercises,
  answerSummaries: UserAnswerSummaryMap,
): CompletionRates => {
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
