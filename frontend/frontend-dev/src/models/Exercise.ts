export interface IExercise {
  pk: number;
  slug: string;
  url: string;
  type: string;
  offering: number;
  topic: string;
  group: string;
}

export interface IExerciseGroups {
  [url: string]: IExercise[];
}
export const groupByURL = (exercises: IExercise[]): IExerciseGroups => {
  const groups: IExerciseGroups = {};

  exercises.forEach((exercise) => {
    if (!groups[exercise.url]) groups[exercise.url] = [];
    groups[exercise.url].push(exercise);
  });

  return groups;
};

export interface ITopicContentExercises {
  [url: string]: IExerciseGroups;
}

export const groupByTopicAndContent = (
  exercises: IExercise[],
): ITopicContentExercises => {
  const groups: ITopicContentExercises = {};

  exercises.forEach((exercise) => {
    const { topic, group } = exercise;
    if (!groups[topic]) groups[topic] = {};
    if (!groups[topic][group]) groups[topic][group] = [];
    groups[topic][group].push(exercise);
  });

  return groups;
};

export const getName = (exercise: IExercise) => {
  const slug = exercise?.slug;
  if (!slug) return "";

  const parts = slug.split("-");
  const name = parts[parts.length - 1].split("_").join(" ");
  if (exercise.type) {
    return `[${exercise.type}] ${name}`;
  } else {
    return slug;
  }
};
