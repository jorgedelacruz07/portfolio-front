/** Skip retries when the route does not exist. Other failures still get two retries. */
export function shouldRetryArticleQuery(
  failureCount: number,
  error: unknown,
): boolean {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;
  if (status === 404) return false;
  return failureCount < 2;
}
