export type ListView = "ready" | "empty" | "no-results";

/** An empty catalog is not the same state as a filter that matched nothing. */
export function listView(total: number, visible: number): ListView {
  if (total <= 0) return "empty";
  if (visible <= 0) return "no-results";
  return "ready";
}
