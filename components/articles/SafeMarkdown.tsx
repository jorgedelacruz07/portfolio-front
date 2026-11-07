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
          <code key={key} className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
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
            className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80 focus-visible:rounded"
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
            className="my-4 rounded-xl border border-border/80 shadow-soft"
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
          return (
            <h1
              key={key}
              className="mt-8 mb-4 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {content}
            </h1>
          );
        case 2:
          return (
            <h2
              key={key}
              className="mt-8 mb-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {content}
            </h2>
          );
        case 3:
          return (
            <h3
              key={key}
              className="mt-6 mb-2 font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl"
            >
              {content}
            </h3>
          );
        default:
          return (
            <h4 key={key} className="mt-4 mb-2 font-serif text-lg font-medium tracking-tight text-foreground">
              {content}
            </h4>
          );
      }
    }
    case "paragraph":
      return (
        <p key={key} className="my-4 text-base leading-7 text-foreground/90 sm:text-lg sm:leading-8">
          {renderInline(block.children, key)}
        </p>
      );
    case "codeblock":
      return (
        <div key={key} className="my-6 overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-soft">
          {block.lang ? (
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span>{block.lang}</span>
            </div>
          ) : null}
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90 sm:text-sm">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-6 border-l-4 border-primary/70 bg-muted/20 py-2 pl-4 italic text-muted-foreground sm:pl-6"
        >
          {block.children.map((child, idx) => renderBlock(child, idx))}
        </blockquote>
      );
    case "unordered_list":
      return (
        <ul key={key} className="my-4 list-disc space-y-2 pl-6 text-foreground/90 sm:text-lg">
          {block.items.map((item, idx) => (
            <li key={`ul-item-${idx}`}>{renderInline(item, `ul-${idx}`)}</li>
          ))}
        </ul>
      );
    case "ordered_list":
      return (
        <ol key={key} className="my-4 list-decimal space-y-2 pl-6 text-foreground/90 sm:text-lg">
          {block.items.map((item, idx) => (
            <li key={`ol-item-${idx}`}>{renderInline(item, `ol-${idx}`)}</li>
          ))}
        </ol>
      );
    case "hr":
      return <hr key={key} className="my-8 border-border/70" />;
    default:
      return null;
  }
}

export function SafeMarkdown({ content, className }: SafeMarkdownProps) {
  const blocks = useMemo(() => parseBlocks(content || ""), [content]);

  return (
    <div className={cn("max-w-none text-foreground select-text", className)}>
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}
