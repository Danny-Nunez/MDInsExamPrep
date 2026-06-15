import type { ReactNode } from "react";

type ChatMessageContentProps = {
  content: string;
};

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${index}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderBlock(block: string, blockIndex: number) {
  const trimmed = block.trim();
  if (!trimmed) return null;

  const lines = trimmed.split("\n");
  const isList = lines.every(
    (line) => line.trim() === "" || /^\s*-\s+/.test(line)
  );

  if (isList) {
    return (
      <ul key={`block-${blockIndex}`} className="list-disc space-y-1.5 pl-4">
        {lines
          .filter((line) => line.trim())
          .map((line, lineIndex) => {
            const match = line.match(/^(\s*)-\s+(.+)$/);
            if (!match) return null;
            const indent = match[1].length;
            const text = match[2];
            return (
              <li
                key={`block-${blockIndex}-line-${lineIndex}`}
                className={indent >= 2 ? "ml-4 list-[circle]" : undefined}
              >
                {parseInline(text, `block-${blockIndex}-line-${lineIndex}`)}
              </li>
            );
          })}
      </ul>
    );
  }

  return (
    <p key={`block-${blockIndex}`} className="whitespace-pre-wrap">
      {parseInline(trimmed, `block-${blockIndex}`)}
    </p>
  );
}

export default function ChatMessageContent({ content }: ChatMessageContentProps) {
  const blocks = content.split(/\n{2,}/);

  return <div className="space-y-3">{blocks.map(renderBlock)}</div>;
}
