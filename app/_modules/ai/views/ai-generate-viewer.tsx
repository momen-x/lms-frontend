"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";

import {
  StudentStudyPlanResponse,
} from "@/app/_modules/ai/entities/ai-response";
import { AiMarkdown } from "@/app/_modules/ai/views/ai-markdown";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface GenerateResponse {
  content: string;
  finishReason: string | null;
  cached?: boolean
}

interface AiGenerateViewerProps {
  planData: StudentStudyPlanResponse | GenerateResponse;
  title: string;
  defaultOpen?: boolean;
}

function isStudyPlanResponse(
  data: StudentStudyPlanResponse | GenerateResponse,
): data is StudentStudyPlanResponse {
  return "plan" in data && "context" in data;
}

export function AiGenerateViewer({
  planData,
  title,
  defaultOpen = true,
}: AiGenerateViewerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isStudyPlan = isStudyPlanResponse(planData);
  const content = isStudyPlan ? planData.plan : planData.content;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 sm:p-6",
          isOpen && "border-b border-slate-100 dark:border-slate-800",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <Sparkles className="size-5" />
          </div>

          <h3 className="truncate font-semibold text-base sm:text-lg">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          {isStudyPlan && (
            <span className="hidden sm:flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <BookOpen className="size-3.5" />
              Lessons Completed: {planData.context.lessons.completedCount}/
              {planData.context.lessons.total}
            </span>
          )}

          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle content"
              />
            }
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="p-4 sm:p-6 pt-4">
          {isStudyPlan && (
            <div className="mb-4 flex sm:hidden items-center gap-1 w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <BookOpen className="size-3.5" />
              Lessons: {planData.context.lessons.completedCount}/
              {planData.context.lessons.total}
            </div>
          )}

          <AiMarkdown content={content} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
