export interface Exercise {
  pk: number;
  slug: string;
  url: string;
  type: string;
  offering: number;
  topic: string;
  group: string;
}

export interface ExerciseGroups {
  [url: string]: Exercise[];
}
export const groupByURL = (exercises: Exercise[]): ExerciseGroups => {
  const groups: ExerciseGroups = {};

  exercises.forEach((exercise) => {
    if (!groups[exercise.url]) groups[exercise.url] = [];
    groups[exercise.url].push(exercise);
  });

  return groups;
};

export interface TopicContentExercises {
  [url: string]: ExerciseGroups;
}

export const groupByTopicAndContent = (
  exercises: Exercise[],
): TopicContentExercises => {
  const groups: TopicContentExercises = {};

  exercises.forEach((exercise) => {
    const { topic, group } = exercise;
    if (!groups[topic]) groups[topic] = {};
    if (!groups[topic][group]) groups[topic][group] = [];
    groups[topic][group].push(exercise);
  });

  return groups;
};
