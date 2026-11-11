/** Index of the next item when Tab wraps inside an open menu. */
export function trappedMenuIndex(length: number, current: number, backwards: boolean): number {
  if (length <= 0) return -1;
  const index = ((current % length) + length) % length;
  if (backwards) return index === 0 ? length - 1 : index - 1;
  return index === length - 1 ? 0 : index + 1;
}
