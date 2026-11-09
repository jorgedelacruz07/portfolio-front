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
  if (options.mailto && protocol === "mailto:") {
    let address: string;
    try {
      address = decodeURIComponent(url.pathname);
    } catch {
      return null;
    }
    if (url.search || !plainEmailAddress(address)) return null;
    return `mailto:${address}`;
  }
  return null;
}

const PLAIN_EMAIL =
  /^[A-Za-z0-9._+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** A mailbox with no header fields. The local-part allows only [A-Za-z0-9._+-]. */
export function plainEmailAddress(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value !== value.trim()
  ) {
    return null;
  }
  if (/[\s%?#/\\<>,;"]/.test(value) || hasControlCharacter(value)) return null;
  if (!PLAIN_EMAIL.test(value)) return null;
  return value;
}

export function mailtoHref(value: unknown): string | null {
  const address = plainEmailAddress(value);
  return address ? `mailto:${address}` : null;
}
