"use client";

import {
  BookOpen,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetLesson } from "@/app/_modules/lesson/hooks/useGetLesson";
import BackBtn from "@/components/sharing/back-btn";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import QueryErrorState from "@/components/sharing/query-error-state";
import NoData from "@/components/sharing/no-data";
import transformingTheDateToATextString from "@/utils/from-date-to-string";
import LessonMedia from "../../media/views/lesson-media";

import { formatDuration } from "@/utils/format-duration";
import { useLessonDialog } from "../context/lesson-dialog-context";
import { useGenerateQuizFromLesson } from "../../ai/hooks/useGenerateQuizFromLesson";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { AiGenerateViewer } from "../../ai/views/ai-generate-viewer";
import { useGetGeneratedLessonQuiz } from "../../ai/hooks/useGetGeneratedLessonQuiz";

export default function LessonDetails() {
  const { openUpdateLesson } = useLessonDialog();
  const params = useParams<{
    id: string;
  }>();

  const lessonId = params.id;
  const {
    mutate: generateQuiz,
    isPending,
    data: quizQuestions,
  } = useGenerateQuizFromLesson();
  const { data: savedQuiz } = useGetGeneratedLessonQuiz(lessonId);
  const quizData =
    quizQuestions ??
    (savedQuiz ? { content: savedQuiz.content, finishReason: null } : null);

  const handleGenerateQuiz = async () => {
    if (!params.id) {
      toast.error("invalid lesson id");
      return;
    }
    generateQuiz(params.id, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The lesson content hasn’t changed, so the existing AI-generated quiz is still up to date.",
          );
          return;
        }

        toast.success("AI quiz generated from the lesson successfully.");
      },
      onError: (error) => {
        toast.error(
          getErrorMessage(error) ??
            "Failed to generate questions. Please try again.",
        );
        console.error("Quiz generation error:", error);
      },
    });
  };
  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetLesson(lessonId);

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="Failed to load lesson details"
        description="We couldn’t load the lesson for this section. Please try again"
        isRetrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  if (!lesson) {
    return <NoData />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Lesson details
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage the lesson content and media.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BackBtn />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              openUpdateLesson(lesson.id);
            }}
          >
            <Pencil className="size-4" />
            Edit lesson
          </Button>
        </div>
      </div>

      {/* Lesson overview */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold md:text-2xl">
                  {lesson.title}
                </h2>

                {lesson.isPreview ? (
                  <Badge className="gap-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
                    <Eye className="size-3.5" />
                    Preview enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <EyeOff className="size-3.5" />
                    Preview disabled
                  </Badge>
                )}
              </div>

              <p className="mt-3 max-w-4xl whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {lesson.description || "No description added for this lesson."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock3 className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="truncate font-semibold">
                  {formatDuration(lesson.duration)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Lesson order</p>
                <p className="font-semibold">{lesson.order}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-semibold">
                  {transformingTheDateToATextString(lesson.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ai  */}
      <div>
        <Button
          onClick={handleGenerateQuiz}
          disabled={isPending}
          variant="outline"
          className="
    border-purple-500/40
    bg-purple-500/5
    text-purple-600
    transition-colors
    hover:border-purple-500/70
    hover:bg-purple-500/10
    hover:text-purple-700
    dark:text-purple-300
    dark:hover:text-purple-200
    mb-5
  "
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              generating
            </>
          ) : savedQuiz?.content ? (
            <>
              <RefreshCw className="size-4" />
              Regenerate Suggested quiz questions
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Suggesting quiz questions for this lesson
            </>
          )}
        </Button>
        {quizData && (
          <AiGenerateViewer
            planData={quizData}
            title=" Your AI Questions Suggesting"
            defaultOpen={false}
          />
        )}
      </div>

      <section className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <LessonMedia lessonId={lessonId} embedded />
      </section>
    </div>
  );
}
