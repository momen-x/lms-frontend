"use client";

import { useState } from "react";

import {
  AlertCircle,
  Award,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileQuestion,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import { StudentQuizAiAnalysis } from "@/app/_modules/ai/views/student-quiz-ai-analysis";
import { CourseLearning } from "@/app/_modules/course/entities/course-learning";
import { AiGeneratingSkeleton } from "@/app/_modules/course/views/learning-view-page/learning-content";
import QuizAttemptView from "./quiz-attempt-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useStartAttempt } from "@/app/_modules/quiz-attempt/hooks/useStartAttempt";
import { useGetStudentQuizAnalysis } from "@/app/_modules/quiz/hooks/useGetStudentQuizAnalysis";
import { useGetAnalyzeStudentQuizPerformance } from "@/app/_modules/ai/hooks/useGetAnalyzeStudentQuizPerformance";
import { useAnalyzeStudentQuizPerformance } from "@/app/_modules/ai/hooks/useAnalyzeStudentQuizPerformance";

import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-axios-error-message";

import { QuizAttempt } from "../../entities/quiz-attempt";
import { StudentAttemptView } from "../../entities/start-quiz";

type LearningQuiz = CourseLearning["quizzes"][number];

interface QuizLearningContentProps {
  quiz: LearningQuiz;
}

export default function QuizLearningContent({
  quiz,
}: QuizLearningContentProps) {
  const startAttempt = useStartAttempt();

  const [activeAttempt, setActiveAttempt] = useState<StudentAttemptView | null>(
    null,
  );
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(
    null,
  );
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const attemptsUsed = quiz.attempts.length;
  const attemptsRemaining = Math.max(quiz.maxAttempts - attemptsUsed, 0);

  const existingActiveAttempt = quiz.attempts.find(
    (attempt) => attempt.status === "in_progress",
  );
  const hasActiveAttempt =
    Boolean(activeAttempt) || Boolean(existingActiveAttempt);

  const submittedAttempts = quiz.attempts.filter(
    (attempt) => attempt.status === "submitted",
  );

  const hasPerfectScore = submittedAttempts.some(
    (attempt) => attempt.score === 100,
  );

  //ai hooks
  const { mutate: analyzePerformance, isPending: isAnalyzing } =
    useAnalyzeStudentQuizPerformance();
  const {
    data: performanceAnalysis,
    isLoading: isPerformanceLoading,
    isError: isPerformanceError,
  } = useGetAnalyzeStudentQuizPerformance(quiz.id);

  const handleAnalyzeQuizClick = () => {
    analyzePerformance(quiz.id, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The Quiz Analysis content hasn’t changed, so the existing AI Analysis is still up to date.",
          );
          return;
        }
        toast.success(
          performanceAnalysis
            ? "Your Quiz analysis refreshed successfully."
            : "Your Quiz analysis generated successfully.",
        );
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(error) ??
            "Failed to generate quiz analysis. Please try again.",
        );
      },
    });
  };

  const hasReachedMaxAttempts =
    attemptsUsed >= quiz.maxAttempts && !hasActiveAttempt;

  const bestScore =
    submittedAttempts.length > 0
      ? Math.max(...submittedAttempts.map((attempt) => attempt.score ?? 0))
      : null;

  const hasPassed = bestScore !== null && bestScore >= quiz.passingScore;

  const handleStartAttempt = async () => {
    if (startAttempt.isPending || hasPerfectScore || hasReachedMaxAttempts) {
      return;
    }

    try {
      const attempt = await startAttempt.mutateAsync(quiz.id);
      setSubmittedAttempt(null);
      setActiveAttempt(attempt);

      toast.success(
        existingActiveAttempt
          ? "Quiz attempt resumed"
          : "Attempt started successfully",
      );
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Unable to start the quiz");
    }
  };

  const handleSubmitted = (attempt: QuizAttempt) => {
    setActiveAttempt(null);
    setSubmittedAttempt(attempt);
  };

  const handleTryAgain = async () => {
    setSubmittedAttempt(null);
    await handleStartAttempt();
  };

  if (activeAttempt) {
    return (
      <QuizAttemptView attempt={activeAttempt} onSubmitted={handleSubmitted} />
    );
  }

  if (submittedAttempt) {
    return (
      <QuizResultView
        quiz={quiz}
        attempt={submittedAttempt}
        attemptsRemaining={Math.max(quiz.maxAttempts - attemptsUsed, 0)}
        onTryAgain={handleTryAgain}
        isStarting={startAttempt.isPending}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="rounded-2xl border bg-card p-4 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileQuestion className="size-6" />
          </div>
          <div className="w-full flex items-center justify-between ">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary">Quiz</p>
              <h1 className="mt-1 wrap-break-word text-xl font-bold tracking-tight sm:text-2xl">
                {quiz.title}
              </h1>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isAnalyzing}
              onClick={handleAnalyzeQuizClick}
              className={cn(
                "shrink-0 border-purple-500/40 bg-purple-500/5",
                "text-purple-600 transition-colors",
                "hover:border-purple-500/70 hover:bg-purple-500/10",
                "hover:text-purple-700",
                "dark:text-purple-300 dark:hover:text-purple-200",
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing...
                </>
              ) : performanceAnalysis ? (
                <>
                  <RefreshCw className="size-4" />
                  Regenerate Analysis
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Analyze Your Quiz Performance By AI
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuizDetail label="Questions" value={String(quiz.questionCount)} />
          <QuizDetail
            label="Duration"
            value={`${quiz.duration} min`}
            icon={<Clock3 className="size-4" />}
          />
          <QuizDetail label="Passing score" value={`${quiz.passingScore}%`} />
          <QuizDetail
            label="Attempts"
            value={`${attemptsUsed} / ${quiz.maxAttempts}`}
          />
        </div>

        {/* Attempt Action States */}
        {hasPerfectScore ? (
          <PerfectScoreState bestScore={bestScore ?? 100} />
        ) : hasActiveAttempt ? (
          <div className="mt-8">
            <div className="rounded-xl bg-muted/50 p-5">
              <p className="font-medium">You have an active attempt</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue your current quiz attempt.
              </p>
            </div>
            <div className="mt-6">
              <Button
                type="button"
                disabled={startAttempt.isPending}
                onClick={handleStartAttempt}
                className="gap-2"
              >
                {startAttempt.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading attempt...
                  </>
                ) : (
                  "Continue Quiz"
                )}
              </Button>
            </div>
          </div>
        ) : hasReachedMaxAttempts ? (
          <div className="mt-8 rounded-xl border bg-muted/40 p-5">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium">No attempts remaining</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You have reached the maximum number of attempts for this quiz.
                </p>
                {bestScore !== null && (
                  <p className="mt-3 text-sm font-medium">
                    Best score: {bestScore}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="rounded-xl bg-muted/50 p-5">
              <p className="font-medium">
                {attemptsUsed === 0
                  ? "Ready to start?"
                  : hasPassed
                    ? "Want to improve your score?"
                    : "Ready to try again?"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You have {attemptsRemaining}{" "}
                {attemptsRemaining === 1 ? "attempt" : "attempts"} remaining.
              </p>
              {bestScore !== null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Best score: {bestScore}%
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                disabled={startAttempt.isPending}
                onClick={handleStartAttempt}
                className="gap-2"
              >
                {startAttempt.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Starting...
                  </>
                ) : attemptsUsed > 0 ? (
                  <>
                    <RotateCcw className="size-4" />
                    Try Again
                  </>
                ) : (
                  "Start Quiz"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Performance Analysis Collapsible */}
        {attemptsUsed > 0 && (
          <Collapsible
            open={isAnalysisOpen}
            onOpenChange={setIsAnalysisOpen}
            className="mt-8 border-t pt-6"
          >
            <CollapsibleTrigger
              render={
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-between gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
                />
              }
            >
              <span className="flex items-center gap-2 font-medium">
                <BarChart2 className="size-4 text-primary" />
                {isAnalysisOpen
                  ? "Hide Performance Analytics"
                  : "View Performance Analytics"}
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  isAnalysisOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <StudentQuizPerformanceAnalysis quizId={quiz.id} />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      <div>
        {isPerformanceLoading ? (
          <AiGeneratingSkeleton />
        ) : isPerformanceError ? (
          <div className="rounded-xl border border-dashed p-5 text-center">
            <p className="text-sm text-muted-foreground">
              No saved analysis is available yet.
            </p>
          </div>
        ) : performanceAnalysis ? (
          <StudentQuizAiAnalysis
            data={performanceAnalysis}
            defaultOpen={false}
          />
        ) : null}
      </div>
    </div>
  );
}

{
  /* Expanded Performance Analytics Component */
}
function StudentQuizPerformanceAnalysis({ quizId }: { quizId: string }) {
  const {
    data: analysis,
    isLoading,
    isError,
  } = useGetStudentQuizAnalysis(quizId);

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border bg-muted/20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="size-4" />
        Failed to load performance analysis.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Attempts Taken</p>
            <p className="mt-1 text-xl font-bold">{analysis.attemptsCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Best Score</p>
            <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {analysis.bestScore !== null ? `${analysis.bestScore}%` : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="mt-1 flex items-center gap-1.5">
              {analysis.passed ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
                  Passed
                </Badge>
              ) : (
                <Badge variant="destructive">Needs Improvement</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wrong Questions Breakdown */}
      {analysis.wrongQuestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="size-4" />
            Questions Needing Review ({analysis.wrongQuestions.length})
          </h4>

          <div className="space-y-2">
            {analysis.wrongQuestions.map((item, idx) => (
              <div
                key={`${item.questionId}-${idx}`}
                className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 dark:border-rose-950/50 dark:bg-rose-950/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium">
                    Attempt #{item.attemptNumber}: {item.text}
                  </p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Your Answer:{" "}
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {item.selectedAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attempts History */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Attempt History</h4>
        <div className="space-y-2">
          {analysis.attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between rounded-xl border bg-background p-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  Attempt #{attempt.attemptNumber}
                </span>
                <span className="text-muted-foreground">
                  {attempt.correctAnswers}/{attempt.totalQuestions} Correct
                </span>
              </div>
              <Badge variant="outline" className="font-bold">
                {attempt.score}%
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizResultView({
  quiz,
  attempt,
  attemptsRemaining,
  onTryAgain,
  isStarting,
}: {
  quiz: LearningQuiz;
  attempt: QuizAttempt;
  attemptsRemaining: number;
  onTryAgain: () => void;
  isStarting: boolean;
}) {
  const score = attempt.score ?? 0;
  const passed = score >= quiz.passingScore;
  const perfectScore = score === 100;
  const canTryAgain = !perfectScore && attemptsRemaining > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="rounded-2xl border bg-card p-4 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            {perfectScore ? (
              <Trophy className="size-8" />
            ) : passed ? (
              <CheckCircle2 className="size-8" />
            ) : (
              <XCircle className="size-8 text-destructive" />
            )}
          </div>

          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Quiz Result
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            {perfectScore
              ? "Perfect Score!"
              : passed
                ? "Quiz Passed"
                : "Quiz Not Passed"}
          </h1>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {perfectScore
              ? "Excellent work. You achieved the highest possible score."
              : passed
                ? "You successfully passed this quiz."
                : attemptsRemaining > 0
                  ? "You can use another attempt to improve your result."
                  : "You have used all available attempts for this quiz."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuizDetail label="Score" value={`${score}%`} />
          <QuizDetail
            label="Earned mark"
            value={
              attempt.earnedMark !== null
                ? `${attempt.earnedMark} / ${quiz.totalMark}`
                : "-"
            }
          />
          <QuizDetail
            label="Correct answers"
            value={
              attempt.correctAnswers !== null && attempt.totalQuestions !== null
                ? `${attempt.correctAnswers} / ${attempt.totalQuestions}`
                : "-"
            }
          />
          <QuizDetail
            label="Attempt"
            value={`${attempt.attemptNumber} / ${quiz.maxAttempts}`}
          />
        </div>

        <div className="mt-8 rounded-xl border bg-muted/40 p-5">
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium">
                {perfectScore
                  ? "No more attempts needed"
                  : passed
                    ? "You passed this quiz"
                    : "Passing score not reached"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Required score: {quiz.passingScore}%
              </p>
              {!perfectScore && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Attempts remaining: {attemptsRemaining}
                </p>
              )}
            </div>
          </div>
        </div>

        {canTryAgain && (
          <div className="mt-6">
            <Button
              type="button"
              disabled={isStarting}
              onClick={onTryAgain}
              className="gap-2"
            >
              {isStarting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PerfectScoreState({ bestScore }: { bestScore: number }) {
  return (
    <div className="mt-8 rounded-xl border bg-muted/40 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Trophy className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">Perfect Score Achieved</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You scored {bestScore}% on this quiz. No additional attempts are
            available or needed.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end sm:gap-3">
          <Link
            href="/student-dashboard/certificates"
            className="w-full sm:w-auto"
          >
            <Button className="w-full">Certificates</Button>
          </Link>
          <Link href="/student-dashboard/courses" className="w-full sm:w-auto">
            <Button className="w-full">Learning</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuizDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
