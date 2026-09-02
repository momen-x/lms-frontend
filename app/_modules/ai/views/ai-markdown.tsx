"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type AiMarkdownProps = {
  content: string;
  className?: string;
};

export function AiMarkdown({
  content,
  className,
}: AiMarkdownProps) {
  return (
    <div
      className={cn(
        "text-sm leading-7 text-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 text-2xl font-bold first:mt-0">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-xl font-semibold first:mt-0">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold first:mt-0">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 text-sm font-semibold">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="my-2 leading-7 text-muted-foreground">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-2 pl-5 text-muted-foreground">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-2 pl-5 text-muted-foreground">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-6">
              {children}
            </li>
          ),

          hr: () => <hr className="my-5 border-border" />,

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-primary pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}