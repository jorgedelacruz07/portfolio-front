export type SafeHrefOptions = {
  /** Allow mailto: links. Off for ordinary external URLs. */
  mailto?: boolean;
  /** Allow a same-origin path such as /documents/cv.pdf. Protocol-relative URLs stay blocked. */
  sameOriginPath?: boolean;
};

function hasControlCharacter(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code <= 31 || code === 127) return true;
  }
  return false;
}

/**
 * Return a URL that is safe to put in an href, or null when it must be rendered as text.
 * External targets are limited to http(s). mailto and same-origin paths are opt-in.
 */
export function safeHref(
  value: unknown,
  options: SafeHrefOptions = {},
): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || hasControlCharacter(trimmed)) return null;

  const normalized = trimmed.replace(/\\/g, "/");
  if (normalized.startsWith("//")) return null;

  if (options.sameOriginPath && normalized.startsWith("/")) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const protocol = url.protocol.toLowerCase();
  if (protocol === "http:" || protocol === "https:") return trimmed;
  if (options.mailto && protocol === "mailto:") return trimmed;
  return null;
}
