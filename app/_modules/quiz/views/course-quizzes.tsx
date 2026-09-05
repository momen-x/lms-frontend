"use client";

import { AlertCircle, CircleHelp, Loader2, Plus, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import BackBtn from "@/components/sharing/back-btn";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import { Button } from "@/components/ui/button";

import { useQuizDialog } from "../context/quiz-dialog-context";
import { useGetCourseQuizzes } from "../hooks/useGetCourseQuizzes";
import { useGenerateQuizFromCourse } from "@/app/_modules/ai/hooks/useGenerateQuizFromCourse";
import QuizCard from "./quiz-card";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { AiGenerateViewer } from "../../ai/views/ai-generate-viewer";
import { useGetGeneratedCourseQuiz } from "../../ai/hooks/useGetGeneratedCourseQuiz";

interface CourseQuizzesProps {
  courseId: string;
}

export default function CourseQuizzes({ courseId }: CourseQuizzesProps) {
  const {
    data: quizzes,
    isPending,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetCourseQuizzes(courseId);
  const { openCreateQuiz } = useQuizDialog();
  const {
    mutate: generateQuiz,
    isPending: isGenerating,
    data: planData,
  } = useGenerateQuizFromCourse();
  const { data: savedQuiz } = useGetGeneratedCourseQuiz(courseId);
  const quizData =
    planData ??
    (savedQuiz ? { content: savedQuiz.content, finishReason: null } : null);

  const handleGenerateCourseQuiz = () => {
    generateQuiz(courseId, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The course content hasn’t changed, so the existing AI-generated course quiz is still up to date.",
          );
          return;
        }

        toast.success("AI course quiz generated successfully.");
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

  if (isLoading) return <ListSkeleton />;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div>
            <Button
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
              onClick={handleGenerateCourseQuiz}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  generating ...
                </>
              ) : savedQuiz?.content ? (<>
               <RefreshCw className="size-4" />
                Regenerate Suggested Questions
              </>) : (
                <>
                  <Sparkles className="size-4" />
                  Make AI Suggests Questions
                </>
              )}
            </Button>
          </div>
          <h3 className="font-semibold">Quizzes</h3>
          <p className="text-sm text-muted-foreground">
            Manage quizzes attached to this course.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BackBtn />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openCreateQuiz}
          >
            <Plus className="size-4" />
            Add quiz
          </Button>
        </div>
      </div>

      {isPending && (
        <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-center">
          <AlertCircle className="size-6 text-destructive" />
          <div>
            <p className="font-medium">Failed to load quizzes</p>
            <p className="text-sm text-muted-foreground">
              An error occurred while loading the course quizzes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            {isFetching && <Loader2 className="size-4 animate-spin" />}
            Try again
          </Button>
        </div>
      )}

      {!isPending && !isError && quizzes?.length === 0 && (
        <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted">
            <CircleHelp className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium">No quizzes yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            This course does not contain any quizzes. Create the first quiz to
            start adding questions.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4"
            onClick={openCreateQuiz}
          >
            <Plus className="size-4" />
            Add quiz
          </Button>
        </div>
      )}

      {!isPending && !isError && Boolean(quizzes?.length) && (
        <div className="space-y-3">
          {quizzes?.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}

      <div>
        {quizData && (
          <AiGenerateViewer
            planData={quizData}
            title=" Your AI Question Quiz Suggesting"
            defaultOpen={false}
          />
        )}
      </div>
    </section>
  );
}
