export interface Exercise {
  slug: string;
  url: string;
  type: string;
  offering: number;
}

export interface UrlExercises {
  [url: string]: Exercise[];
}

export const groupByURL = (exercises: Exercise[]): UrlExercises => {
  const groups: UrlExercises = {};

  exercises.forEach((exercise) => {
    if (!groups[exercise.url]) groups[exercise.url] = [];
    groups[exercise.url].push(exercise);
  });

  return groups;
};
