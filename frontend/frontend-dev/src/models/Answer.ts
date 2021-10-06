export interface IAnswer {
  pk: number;
  user: number;
  exercise: number;
  points: number;
  submission_date: string;
  test_results: any;
  student_input: any;
}

export interface ICodeAnswerSummary {
  passed: string;
}
