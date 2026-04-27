/**
 * Tiny inline markdown renderer for chat messages.
 * Handles **bold**, *italic*, `code`, links, images, bullet lists, and citation [n] markers.
 * Intentionally small to avoid pulling in a full markdown parser.
 */

import { Fragment } from "react";

export function MiniMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="prose-chat">
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        const lines = trimmed.split("\n");
        const isList = lines.every((l) => /^\s*[-*]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi}>
              {lines.map((l, i) => (
                <li key={i}>{renderInline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        const isHeading = /^#{1,3}\s+/.test(trimmed);
        if (isHeading) {
          const level = trimmed.match(/^#+/)?.[0].length ?? 2;
          const content = trimmed.replace(/^#{1,3}\s+/, "");
          const Tag = (`h${Math.min(level + 2, 6)}`) as keyof JSX.IntrinsicElements;
          return (
            <Tag key={bi} className="font-semibold mt-2">
              {renderInline(content)}
            </Tag>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, i) => (
              <Fragment key={i}>
                {renderInline(l)}
                {i < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  // Order matters: bold, then code, then links, then citations, then italic
  const patterns: Array<{
    re: RegExp;
    render: (match: RegExpExecArray) => React.ReactNode;
  }> = [
    {
      re: /\*\*([^*]+)\*\*/,
      render: (m) => <strong key={key++}>{m[1]}</strong>,
    },
    {
      re: /`([^`]+)`/,
      render: (m) => <code key={key++}>{m[1]}</code>,
    },
    {
      re: /!\[([^\]]*)\]\((https?:[^)]+)\)/,
      render: (m) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key++} src={m[2]} alt={m[1]} className="my-2 max-w-full rounded-lg" loading="lazy" />
      ),
    },
    {
      re: /\[([^\]]+)\]\((https?:[^)]+)\)/,
      render: (m) => (
        <a key={key++} href={m[2]} target="_blank" rel="noreferrer">
          {m[1]}
        </a>
      ),
    },
    {
      re: /\[(\d+)\]/,
      render: (m) => (
        <sup key={key++} className="accent-text font-semibold">
          [{m[1]}]
        </sup>
      ),
    },
    {
      re: /\*([^*]+)\*/,
      render: (m) => <em key={key++}>{m[1]}</em>,
    },
  ];

  while (remaining.length > 0) {
    let earliest: { idx: number; m: RegExpExecArray; render: (m: RegExpExecArray) => React.ReactNode } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, m, render: p.render };
      }
    }
    if (!earliest) {
      parts.push(remaining);
      break;
    }
    if (earliest.idx > 0) parts.push(remaining.slice(0, earliest.idx));
    parts.push(earliest.render(earliest.m));
    remaining = remaining.slice(earliest.idx + earliest.m[0].length);
  }
  return parts;
}
