/**
 * 
 * @param route Dynamic route. Ex:
 * ```typescript
 *    "/api/offerings/:off_pk/exercises/:ex_slug/answers/"
 * ```
 * @param params Object with dynamic params. Ex:
 * ```typescript
 * {off_pk: 1, ex_slug: 'quiz-0'})
 * ```
 * @returns Properly filled route
 * ```typescript
 * "/api/offerings/1/exercises/quiz-0/answers"
 * ```
 */
export function dynamicPathname(
  route: string,
  params: Record<string, string>
) {
  for (let [key, value] of Object.entries(params)) {
    const regexp = new RegExp(`:${key}`, 'g');
    route = route.replace(regexp, value);
  }
  return route;
}
