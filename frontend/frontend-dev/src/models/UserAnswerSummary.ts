export interface IUserAnswerSummary {
  pk: number;
  user: number;
  exercise: number;
  max_points: number;
  answer_count: number;
  latest: number;
}

export interface IUserAnswerSummaryMap {
  [exercise: number]: IUserAnswerSummary;
}

export const summaryListToMap = (
  summaryList: IUserAnswerSummary[],
): IUserAnswerSummaryMap => {
  return Object.fromEntries(
    summaryList.map((summary) => [summary.exercise, summary]),
  );
};
