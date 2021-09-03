export interface UserAnswerSummary {
  pk: number;
  user: number;
  exercise: number;
  max_points: number;
  answer_count: number;
  latest: number;
}

export interface UserAnswerSummaryMap {
  [exercise: number]: UserAnswerSummary;
}

export const summaryListToMap = (
  summaryList: UserAnswerSummary[],
): UserAnswerSummaryMap => {
  return Object.fromEntries(
    summaryList.map((summary) => [summary.exercise, summary]),
  );
};
