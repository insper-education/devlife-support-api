// AUTHENTICATION
export const USER_DATA_PATH = "/api/auth/user/";
export const LOGIN_PATH = "/api/auth/login/";
export const PASSWORD_LOST_PATH = "/api/auth/password/reset/";
export const PASSWORD_RESET_PATH = "/api/auth/password/reset/confirm/";

// EXERCISES
export const LIST_EXERCISES = "/api/offerings/:offering/exercises/";
export const EXERCISE_ANSWER =
  "/api/offerings/:offering/exercises/:exerciseSlug/answers/:answerId/";
export const LIST_EXERCISE_ANSWERS =
  "/api/offerings/:offering/exercises/:slug/answers/";

export const LIST_EXERCISES_SUMMARIES = "/api/offerings/:offering/summaries/";
export const EXERCISE_SUMMARY =
  "/api/offerings/:offering/summaries/:exerciseSlug/";
