"use client";

import {
  AlertCircle,
  ChevronsDownUp,
  ChevronsUpDown,
  CircleHelp,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import BackBtn from "@/components/sharing/back-btn";
import { getErrorMessage } from "@/utils/get-axios-error-message";

import { useQuestionDialog } from "../context/question-dialog-context";
import { useDeleteQuestion } from "../hooks/useDeleteQuestion";
import { useGetQuestionBankQuestions } from "../hooks/useGetQuestionBankQuestions";
import QuestionCard from "./question-card";
import { useGenerateQuizFromCourse } from "../../ai/hooks/useGenerateQuizFromCourse";
import { useGetGeneratedCourseQuiz } from "../../ai/hooks/useGetGeneratedCourseQuiz";
import { AiGenerateViewer } from "../../ai/views/ai-generate-viewer";

interface QuestionBankQuestionsProps {
  questionBankId: string;
  courseId: string;
}

export default function QuestionBankQuestions({
  questionBankId,
  courseId,
}: QuestionBankQuestionsProps) {
  const {
    data: questions,
    isPending,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetQuestionBankQuestions(questionBankId);
  const { openCreateQuestion } = useQuestionDialog();
  const { mutateAsync: deleteQuestion, isPending: isDeleting } =
    useDeleteQuestion();
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(
    new Set(),
  );

  const allQuestionsExpanded =
    Boolean(questions?.length) &&
    questions!.every((question) => expandedQuestionIds.has(question.id));

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestionIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteQuestion({ questionId, questionBankId });
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Failed to delete question");
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Questions</h1>
          <p className="text-sm text-muted-foreground">
            Manage the questions belonging to this question bank.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <BackBtn />
            <Button
              type="button"
              size="sm"
              onClick={() => openCreateQuestion(questionBankId)}
            >
              <Plus className="size-4" />
              Add question
            </Button>
          </div>
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
            ) : savedQuiz?.content ? (
              <>
                <RefreshCw className="size-4" />
                Regenerate Suggested Questions
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Make AI Suggests Questions
              </>
            )}
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
            <p className="font-medium">Failed to load questions</p>
            <p className="text-sm text-muted-foreground">
              An error occurred while loading the question-bank questions.
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

      {!isPending && !isError && questions?.length === 0 && (
        <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted">
            <CircleHelp className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium">No questions yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            This question bank does not contain any questions. Add the first
            question to begin building it.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4"
            onClick={() => openCreateQuestion(questionBankId)}
          >
            <Plus className="size-4" />
            Add question
          </Button>
        </div>
      )}

      {!isPending && !isError && Boolean(questions?.length) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Click a question to show or hide its answer choices.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setExpandedQuestionIds(
                  allQuestionsExpanded
                    ? new Set()
                    : new Set(questions?.map((question) => question.id)),
                )
              }
            >
              {allQuestionsExpanded ? (
                <ChevronsDownUp className="size-4" />
              ) : (
                <ChevronsUpDown className="size-4" />
              )}
              {allQuestionsExpanded ? "Collapse all" : "Expand all"}
            </Button>
          </div>

          {questions?.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              isExpanded={expandedQuestionIds.has(question.id)}
              onToggle={() => toggleQuestion(question.id)}
              isDeleting={isDeleting}
              onDelete={() => handleDelete(question.id)}
            />
          ))}
        </div>
      )}
      <div>
        {quizData?.content && (
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
