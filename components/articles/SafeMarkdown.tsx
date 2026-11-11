import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { type BlockToken, type InlineToken, isSafeUrl, parseBlocks, parseInline } from "@/lib/markdown";

export { isSafeUrl, parseBlocks, parseInline };

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

function renderInline(tokens: InlineToken[], keyPrefix = "inline"): React.ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (token.type) {
      case "text":
        // Raw text is rendered natively as React text children, guaranteeing HTML escaping
        return <React.Fragment key={key}>{token.text}</React.Fragment>;
      case "code":
        return (
          <code key={key} className="font-mono">
            {token.text}
          </code>
        );
      case "bold":
        return (
          <strong key={key} className="font-semibold text-foreground">
            {renderInline(token.children, key)}
          </strong>
        );
      case "italic":
        return (
          <em key={key} className="italic text-foreground">
            {renderInline(token.children, key)}
          </em>
        );
      case "link": {
        const isExternal = token.href.startsWith("http://") || token.href.startsWith("https://");
        return (
          <a
            key={key}
            href={token.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="font-medium text-primary underline underline-offset-4"
          >
            {renderInline(token.children, key)}
          </a>
        );
      }
      case "image":
        return (
          <img
            key={key}
            src={token.src}
            alt={token.alt}
            loading="lazy"
            className="my-4 rounded-lg border border-border"
          />
        );
      default:
        return null;
    }
  });
}

function renderBlock(block: BlockToken, index: number): React.ReactNode {
  const key = `block-${index}`;

  switch (block.type) {
    case "heading": {
      const content = renderInline(block.children, key);
      switch (block.level) {
        case 1:
          return <h1 key={key}>{content}</h1>;
        case 2:
          return <h2 key={key}>{content}</h2>;
        case 3:
          return <h3 key={key}>{content}</h3>;
        default:
          return <h4 key={key}>{content}</h4>;
      }
    }
    case "paragraph":
      return <p key={key}>{renderInline(block.children, key)}</p>;
    case "codeblock":
      return (
        <div key={key} className="my-6 overflow-hidden rounded-lg border border-border bg-muted">
          {block.lang ? (
            <div className="border-b border-border bg-muted px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <span>{block.lang}</span>
            </div>
          ) : null}
          <pre className="overflow-x-auto p-4">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="my-6 border-l-2 border-border pl-4 text-muted-foreground">
          {block.children.map((child, idx) => renderBlock(child, idx))}
        </blockquote>
      );
    case "unordered_list":
      return (
        <ul key={key}>
          {block.items.map((item, idx) => (
            <li key={`ul-item-${idx}`}>{renderInline(item, `ul-${idx}`)}</li>
          ))}
        </ul>
      );
    case "ordered_list":
      return (
        <ol key={key}>
          {block.items.map((item, idx) => (
            <li key={`ol-item-${idx}`}>{renderInline(item, `ol-${idx}`)}</li>
          ))}
        </ol>
      );
    case "hr":
      return <hr key={key} />;
    default:
      return null;
  }
}

export function SafeMarkdown({ content, className }: SafeMarkdownProps) {
  const blocks = useMemo(() => parseBlocks(content || ""), [content]);

  return <div className={cn("article-body", className)}>{blocks.map((block, idx) => renderBlock(block, idx))}</div>;
}
