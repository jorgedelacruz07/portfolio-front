export const SAFE_PROTOCOL_PATTERN = /^(https?:\/\/|\/|#|\.\/)/i;
export const UNSAFE_PROTOCOL_PATTERN = /^(javascript|data|vbscript|file):/i;

export function isSafeUrl(url: unknown): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (UNSAFE_PROTOCOL_PATTERN.test(trimmed)) return false;
  return SAFE_PROTOCOL_PATTERN.test(trimmed);
}

// Inline token types
export type InlineToken =
  | { type: "text"; text: string }
  | { type: "bold"; children: InlineToken[] }
  | { type: "italic"; children: InlineToken[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: InlineToken[] }
  | { type: "image"; src: string; alt: string };

// Block token types
export type BlockToken =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineToken[] }
  | { type: "codeblock"; lang: string; code: string }
  | { type: "blockquote"; children: BlockToken[] }
  | { type: "unordered_list"; items: InlineToken[][] }
  | { type: "ordered_list"; items: InlineToken[][] }
  | { type: "hr" }
  | { type: "paragraph"; children: InlineToken[] };

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let index = 0;

  while (index < text.length) {
    // 1. Inline code: `...`
    if (text[index] === "`") {
      const end = text.indexOf("`", index + 1);
      if (end !== -1) {
        tokens.push({ type: "code", text: text.slice(index + 1, end) });
        index = end + 1;
        continue;
      }
    }

    // 2. Images: ![alt](url)
    if (text.startsWith("![", index)) {
      const closingBracket = text.indexOf("]", index + 2);
      if (closingBracket !== -1 && text[closingBracket + 1] === "(") {
        const closingParen = text.indexOf(")", closingBracket + 2);
        if (closingParen !== -1) {
          const alt = text.slice(index + 2, closingBracket);
          const rawUrl = text.slice(closingBracket + 2, closingParen).trim();
          const src = isSafeUrl(rawUrl) ? rawUrl : "";
          if (src) {
            tokens.push({ type: "image", src, alt });
          }
          index = closingParen + 1;
          continue;
        }
      }
    }

    // 3. Links: [label](url)
    if (text[index] === "[") {
      const closingBracket = text.indexOf("]", index + 1);
      if (closingBracket !== -1 && text[closingBracket + 1] === "(") {
        const closingParen = text.indexOf(")", closingBracket + 2);
        if (closingParen !== -1) {
          const label = text.slice(index + 1, closingBracket);
          const rawUrl = text.slice(closingBracket + 2, closingParen).trim();
          const href = isSafeUrl(rawUrl) ? rawUrl : "";
          const linkChildren = parseInline(label);
          if (href) {
            tokens.push({ type: "link", href, children: linkChildren });
          } else {
            // Unsafe or rejected scheme: render label as text, never execute link
            tokens.push(...linkChildren);
          }
          index = closingParen + 1;
          continue;
        }
      }
    }

    // 4. Bold: **...** or __...__
    if (text.startsWith("**", index) || text.startsWith("__", index)) {
      const delim = text.slice(index, index + 2);
      const end = text.indexOf(delim, index + 2);
      if (end !== -1) {
        const inner = text.slice(index + 2, end);
        tokens.push({ type: "bold", children: parseInline(inner) });
        index = end + 2;
        continue;
      }
    }

    // 5. Italic: *...* or _..._
    if (text[index] === "*" || text[index] === "_") {
      const delim = text[index];
      const end = text.indexOf(delim, index + 1);
      if (end !== -1 && end > index + 1 && text[end - 1] !== " ") {
        const inner = text.slice(index + 1, end);
        tokens.push({ type: "italic", children: parseInline(inner) });
        index = end + 1;
        continue;
      }
    }

    // Plain text chunk
    let nextSpecial = text.length;
    for (const spec of ["`", "![", "[", "**", "__", "*", "_"]) {
      const pos = text.indexOf(spec, index);
      if (pos !== -1 && pos < nextSpecial) {
        nextSpecial = pos;
      }
    }

    if (nextSpecial === index) {
      tokens.push({ type: "text", text: text[index] });
      index++;
    } else {
      tokens.push({ type: "text", text: text.slice(index, nextSpecial) });
      index = nextSpecial;
    }
  }

  return tokens;
}

export function parseBlocks(markdown: string): BlockToken[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: BlockToken[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Code blocks: ```
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({ type: "codeblock", lang, code: codeLines.join("\n") });
      continue;
    }

    // Horizontal rules: --- or ***
    if (/^(---|___|\*\*\*)$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings: # through ######
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        type: "heading",
        level,
        children: parseInline(headingMatch[2].trim()),
      });
      i++;
      continue;
    }

    // Blockquote: > ...
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({
        type: "blockquote",
        children: parseBlocks(quoteLines.join("\n")),
      });
      continue;
    }

    // Unordered lists: - or *
    if (/^\s*[-*]\s+/.test(line)) {
      const items: InlineToken[][] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*[-*]\s+/, "");
        items.push(parseInline(itemText));
        i++;
      }
      blocks.push({ type: "unordered_list", items });
      continue;
    }

    // Ordered lists: 1. or 2.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: InlineToken[][] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*\d+\.\s+/, "");
        items.push(parseInline(itemText));
        i++;
      }
      blocks.push({ type: "ordered_list", items });
      continue;
    }

    // Paragraph (collect contiguous text lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(---|___|\*\*\*)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    blocks.push({
      type: "paragraph",
      children: parseInline(paraLines.join(" ")),
    });
  }

  return blocks;
}
