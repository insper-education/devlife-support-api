export interface IAnswer {
  pk: number;
  user: number;
  exercise: number;
  points: number;
  submissionDate: string;
  summary: any;
  long_answer: any;
}

export interface ICodeAnswerSummary {
  passed: string;
}
