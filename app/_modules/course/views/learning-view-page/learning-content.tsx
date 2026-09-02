"use client";

import Link from "next/link";
import { Loader2, PlayCircle, RefreshCw, Sparkles } from "lucide-react";
import LessonMediaViewer from "./lesson-media-viewer";
import { Button, buttonVariants } from "@/components/ui/button";
import { AiGenerateViewer } from "@/app/_modules/ai/views/ai-generate-viewer";
import { AiLessonAssistantSidebar } from "@/app/_modules/ai/views/ai-lesson-assistant-sidebar";
import { CourseLearning } from "../../entities/course-learning";


import { useGetGeneratedLessonSummary } from "@/app/_modules/ai/hooks/useGetGeneratedLessonSummary";
import { useGenerateLessonSummary } from "@/app/_modules/ai/hooks/useGenerateLessonSummary";

import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-axios-error-message";

import { toast } from "react-toastify";

type LearningLesson = CourseLearning["sections"][number]["lessons"][number];

interface LearningContentProps {
  lesson: LearningLesson | null;
}

export default function LearningContent({ lesson }: LearningContentProps) {
  const lessonId = lesson?.id ?? "";

  const {
    data: summary,
    isPending: isSummaryLoading,
    isError: isSummaryError,
  } = useGetGeneratedLessonSummary(lessonId);

  const {
    mutate: generateLessonSummary,
    isPending: isGenerating,
    data: generate,
  } = useGenerateLessonSummary();
  

  const handleGenerate = () => {
    if (!lesson) {
      return;
    }

    generateLessonSummary(lesson.id, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The lesson content hasn’t changed, so the existing AI summary is still up to date.",
          );
          return;
        }
        toast.success(
          summary
            ? "Lesson summary refreshed successfully."
            : "Lesson summary generated successfully.",
        );
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(error) ??
            "Failed to generate lesson summary. Please try again.",
        );
      },
    });
  };

  if (!lesson) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <div>
          <PlayCircle className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">No lesson available</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This course does not have any lessons yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Back */}
        <div className="flex justify-end">
          <Link href="/student-dashboard/courses" className={buttonVariants()}>
            Back to Learning
          </Link>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-6 border-b pb-6">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">Lesson</p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {lesson.description}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isGenerating || isSummaryLoading}
            onClick={handleGenerate}
            className={cn(
              "shrink-0 border-purple-500/40 bg-purple-500/5",
              "text-purple-600 transition-colors",
              "hover:border-purple-500/70 hover:bg-purple-500/10",
              "hover:text-purple-700",
              "dark:text-purple-300 dark:hover:text-purple-200",
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : summary ? (
              <>
                <RefreshCw className="size-4" />
                Regenerate Summary
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Summarize Lesson
              </>
            )}
          </Button>
        </header>

        {/* Lesson media */}
        <div className="mt-8 space-y-6">
          {lesson.media.length > 0 ? (
            lesson.media.map((media) => (
              <LessonMediaViewer key={media.id} media={media} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No media available for this lesson.
              </p>
            </div>
          )}
        </div>

        {/* Saved/generated summary */}
        <div className="mt-7">
          {isSummaryLoading ? (
            <AiGeneratingSkeleton />
          ) : isSummaryError ? (
            <div className="rounded-xl border border-dashed p-5 text-center">
              <p className="text-sm text-muted-foreground">
                No saved summary is available yet.
              </p>
            </div>
          ) : summary?.content ? (
            <AiGenerateViewer
              planData={{
                content: summary.content,
                finishReason: generate ? generate.finishReason : null,
              }}
              title="AI Lesson Summary"
              defaultOpen={false}
            />
          ) : null}
        </div>
      </main>

      {/* Lesson AI Assistant */}
      <AiLessonAssistantSidebar lessonId={lesson.id} />
    </div>
  );
}

export function AiGeneratingSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex animate-pulse items-center gap-3">
        <div className="size-10 rounded-xl bg-muted" />

        <div className="h-5 w-52 rounded bg-muted" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-11/12 rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}
