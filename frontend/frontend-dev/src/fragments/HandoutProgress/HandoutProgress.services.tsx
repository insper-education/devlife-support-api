import { useEffect, useState } from "react";
import { Exercise } from "../../models/Exercise";
import { User } from "../../models/User";
import { UserAnswerSummary } from "../../models/UserAnswerSummary";
import { getAnswerSummary } from "../../services/exercises";

export const useAnswerSummaries = (
  offering: number,
  user: User,
  exercises: Exercise[],
) => {
  const [percent, setPercent] = useState<number>(0);
  const [summaries, setSummaries] = useState<UserAnswerSummary[]>([]);
  const step = exercises.length ? 1 / exercises.length : 0;

  useEffect(() => {
    Promise.all(
      exercises.map((exercise) =>
        getAnswerSummary(offering, exercise.slug, user).finally(() =>
          setPercent((p) => p + step),
        ),
      ),
    )
      .then(setSummaries)
      .finally(() => setPercent(1));
  }, []);

  return { percent, summaries };
};

export const conclusionPercent = (
  summaries: UserAnswerSummary[],
  total: number,
): number => {
  return (
    (summaries.map((summary) => summary.max_points).reduce((a, b) => a + b, 0) *
      100) /
    total
  );
};
