"use client";

import { FormEvent, useId, useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  Info,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import transformingTheDateToATextString from "@/utils/from-date-to-string";

import type { AIMessage, AIMessageSource } from "../entities/ai-response";

import { AiMarkdown } from "./ai-markdown";

type AiAssistantProps = {
  title: string;
  description: string;
  historyText?: string;
  placeholder: string;

  messageHistory: AIMessage[];

  isHistoryPending: boolean;
  isHistoryError: boolean;
  historyError: unknown;

  isAsking: boolean;

  onAsk: (question: string) => Promise<void>;

  onClose?: () => void;
};

export function AiAssistant({
  title,
  description,
  historyText,
  placeholder,
  messageHistory: messages,
  isHistoryPending,
  isHistoryError,
  historyError,
  isAsking,
  onAsk,
  onClose,
}: AiAssistantProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isAsking) {
      return;
    }

    setInput("");

    try {
      await onAsk(question);
    } catch (error) {
      setInput(question);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <aside className="flex h-full max-h-screen w-80 shrink-0 flex-col overflow-hidden border-l bg-background md:w-96 mr-3 ml-0">
      <header className="flex shrink-0 items-start justify-between gap-3 border-b p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{title}</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Close AI assistant"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        )}
      </header>

      <div className="shrink-0 border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />

          <p>
            {historyText
              ? historyText
              : "Your conversation history is saved for this context."}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent ">
        {isHistoryPending ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isHistoryError ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-4 text-center">
            <Info className="size-6 text-destructive" />

            <h3 className="mt-3 text-sm font-semibold">
              Failed to load conversation
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {getErrorMessage(historyError)}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <EmptyChat title={title} description={description} />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col",
                message.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border bg-muted/50 text-foreground",
                )}
              >
                <AiMarkdown content={message.content} />
              </div>

              <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                {message.role === "user" ? "You" : "AI Assistant"}{" "}
                {transformingTheDateToATextString(message.createdAt)}
              </span>

              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <MessageSources sources={message.sources} />
                )}
            </div>
          ))
        )}

        {isAsking && <ThinkingMessage />}
        <div ref={messagesEndRef} />
      </div>

      <footer className="shrink-0 border-t p-4">
        <form className="flex items-end gap-2" onSubmit={handleSubmit}>
          <textarea
            value={input}
            rows={1}
            maxLength={1000}
            disabled={isAsking}
            placeholder={placeholder}
            className="min-h-10 max-h-32 flex-1 resize-none rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-xl"
            disabled={!input.trim() || isAsking}
          >
            {isAsking ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>

        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI responses may contain mistakes. Verify important information.
        </p>
      </footer>
    </aside>
  );
}

type EmptyChatProps = {
  title: string;
  description: string;
};

function EmptyChat({ title, description }: EmptyChatProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>

      <p className="mt-1 max-w-64 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ThinkingMessage() {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border bg-muted/50 px-4 py-3">
        <Sparkles className="size-4 text-primary" />

        <div className="flex gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

type MessageSourcesProps = {
  sources: AIMessageSource[];
};

function MessageSources({ sources }: MessageSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sourcesId = useId();

  return (
    <div className="mt-3 w-full max-w-[88%]">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={sourcesId}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Info className="size-3.5 shrink-0" />
        <span>Sources</span>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none tabular-nums">
          {sources.length}
        </span>
        <ChevronDown
          className={cn(
            "ml-auto size-3.5 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={sourcesId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          isOpen
            ? "mt-2 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="space-y-2 overflow-hidden">
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="rounded-lg border bg-background p-2.5"
            >
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="text-xs font-medium">Source {index + 1}</p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Page {source.pageNumber} • Chunk {source.chunkIndex + 1}
                  </p>

                  {source.content && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {source.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
