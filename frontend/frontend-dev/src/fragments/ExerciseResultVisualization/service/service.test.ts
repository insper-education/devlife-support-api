import {
  extractCompletionRatesFromExerciseGroups,
  extractCompletionRatesFromExercises,
  extractCompletionRatesFromTopicContents,
} from ".";
import {
  Exercise,
  ExerciseGroups,
  TopicContentExercises,
} from "../../../models/Exercise";
import { UserAnswerSummary } from "../../../models/UserAnswerSummary";

const createExercises = (
  points: number[],
  startPk: number,
  url: string,
  topic: string,
  contentGroup: string,
): Exercise[] => {
  return points.map((p, idx) => ({
    pk: startPk + idx,
    slug: `exercise-${startPk + idx}`,
    url,
    type: "code",
    offering: 1,
    topic,
    contentGroup,
  }));
};

const createSummaries = (
  exercises: Exercise[],
  points: number[],
  startPk: number,
) => {
  return exercises.map((exercise, idx) => {
    const pts = points[idx];
    return {
      pk: startPk + idx,
      user: 1,
      exercise: exercise.pk,
      max_points: pts,
      answer_count: 3,
      latest: 1,
    };
  });
};

const createGroups = (
  groups: number[],
  groupPoints: number[][],
  topic: string,
): [ExerciseGroups, UserAnswerSummary[]] => {
  const answerSummaries: UserAnswerSummary[] = [];
  const exerciseGroups = Object.fromEntries(
    groups.map((groupId, idx) => {
      const points = groupPoints[idx];
      const startIdx = groupPoints
        .map((pts, ptsIdx) => (ptsIdx < idx ? pts.length : 0))
        .reduce((a, b) => a + b, 0);
      const exercises = createExercises(
        points,
        startIdx,
        "exercise.com/1/",
        topic,
        `group${groupId}`,
      );
      const summaries = createSummaries(exercises, points, startIdx);
      answerSummaries.push(...summaries);
      return [`group${groupId}`, exercises];
    }),
  );
  return [exerciseGroups, answerSummaries];
};

const createTopics = (
  topics: number[],
  allGroups: number[][],
  allGroupPoints: number[][][],
): [TopicContentExercises, UserAnswerSummary[]] => {
  const answerSummaries: UserAnswerSummary[] = [];
  const topicGroups: TopicContentExercises = Object.fromEntries(
    topics.map((topic, topicIdx) => {
      const [exerciseGroups, summaries] = createGroups(
        allGroups[topicIdx],
        allGroupPoints[topicIdx],
        `topic${topic}`,
      );
      answerSummaries.push(...summaries);
      return [`topic${topic}`, exerciseGroups];
    }),
  );
  return [topicGroups, answerSummaries];
};

describe("Extract completion rates", () => {
  it("from exercise list", async () => {
    const points = [0, 0.5, 0.5, 0.5];
    const exercises = createExercises(
      points,
      0,
      "exercise.com/1/",
      "topic1",
      "group1",
    );
    const answerSummaries = createSummaries(exercises, points, 0);
    const completionRates = extractCompletionRatesFromExercises(
      exercises,
      answerSummaries,
    );
    exercises.forEach((exercise, idx) => {
      expect(completionRates[exercise.slug]).toBe(points[idx]);
    });
  });

  it("from exercise group", async () => {
    const groups = [1, 2, 3];
    const groupPoints = [
      [0.2, 0.5, 0.8],
      [0.6, 0.8],
      [0.4, 1.0, 1.0],
    ];
    const expected = [0.5, 0.7, 0.8];
    const [exerciseGroups, answerSummaries] = createGroups(
      groups,
      groupPoints,
      "topic1",
    );
    const completionRates = extractCompletionRatesFromExerciseGroups(
      exerciseGroups,
      answerSummaries,
    );
    groups.forEach((groupId, idx) => {
      expect(completionRates[`group${groupId}`]).toBeCloseTo(expected[idx]);
    });
  });

  it("from topic", async () => {
    const topics = [1, 2];
    const allGroups = [
      [1, 2, 3],
      [1, 2],
    ];
    const allGroupPoints = [
      [
        [0.2, 0.5, 0.8],
        [0.6, 0.8],
        [0.4, 1.0, 1.0],
      ],
      [[0.3, 0.9], [0.3]],
    ];
    const expected = [0.6625, 0.5];
    const [exerciseTopics, answerSummaries] = createTopics(
      topics,
      allGroups,
      allGroupPoints,
    );
    const completionRates = extractCompletionRatesFromTopicContents(
      exerciseTopics,
      answerSummaries,
    );
    topics.forEach((topicId, idx) => {
      expect(completionRates[`topic${topicId}`]).toBeCloseTo(expected[idx]);
    });
  });
});
