export interface Answer {
  pk: number;
  user: number;
  exercise: number;
  points: number;
  submissionDate: string;
  summary: any;
  long_answer: any;
}

export interface CodeAnswerSummary {
  passed: string;
}
