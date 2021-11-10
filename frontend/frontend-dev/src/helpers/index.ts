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
export function dynamicPathname(route: string, params: Record<string, string|number>) {
  for (let [key, value] of Object.entries(params)) {
    const regexp = new RegExp(`:${key}`, "g");
    route = route.replace(regexp, String(value));
  }
  return route;
}

/**
 * Generates an array of arbitrary size.
 * 
 * Can be called with either one parameter (which will be `amount`) 
 * or two parameters (`start` and `end` not included)
 */
export function range(...args: [amount: number] | [start: number, end: number]) {
  if (args.length == 1) {
    return Array.from(Array(args[0]).keys());
  }
  const [start, end] = args;
  return Array.from(Array(end - start).keys()).map(n => start + n);
}