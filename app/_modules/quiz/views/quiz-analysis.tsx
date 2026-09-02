"use client";

import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetQuiz } from "../hooks/useGetQuiz";
import { useGetQuizPerformanceAnalysis } from "../hooks/useGetQuizPerformanceAnalysis";
import { useGetInstructorQuizAnalysis } from "../../ai/hooks/useGetInstructorQuizAnalysis";
import { QuizInstructorAiAnalysis } from "../../ai/views/quiz-instructor-ai-analysis";
import { AiGeneratingSkeleton } from "../../course/views/learning-view-page/learning-content";
import { useAnalyzeQuizForInstructor } from "../../ai/hooks/useAnalyzeQuizForInstructor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/get-axios-error-message";

interface QuizDashboardProps {
  quizId: string;
}

export function QuizDashboard({ quizId }: QuizDashboardProps) {
  const {
    data: quiz,
    isLoading: isQuizLoading,
    isError: isQuizError,
  } = useGetQuiz(quizId);

  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
  } = useGetQuizPerformanceAnalysis(quizId);

  const {
    data: getAnalysis,
    isLoading: isInstructorAnalysisLoading,
    isError: isInstructorAnalysisError,
  } = useGetInstructorQuizAnalysis(quizId);

  const { mutate: handleAnalyzeQuiz, isPending: isAiAnalysisPending } =
    useAnalyzeQuizForInstructor();

  const handleAnalyzeQuizClick = () => {
    handleAnalyzeQuiz(quizId, {
      onSuccess: (response) => {
        if (response.cached) {
          toast.info(
            "The Quiz Analysis content hasn’t changed, so the existing AI Analysis is still up to date.",
          );
          return;
        }
        toast.success(
          getAnalysis
            ? "Quiz analysis refreshed successfully."
            : "Quiz analysis generated successfully.",
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

  if (isQuizLoading || isAnalysisLoading) {
    return <QuizDashboardSkeleton />;
  }

  if (isQuizError || isAnalysisError || !quiz || !analysis) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        Failed to load quiz analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {quiz.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Performance breakdown and student engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isAiAnalysisPending}
            onClick={handleAnalyzeQuizClick}
            className={cn(
              "shrink-0 border-purple-500/40 bg-purple-500/5",
              "text-purple-600 transition-colors",
              "hover:border-purple-500/70 hover:bg-purple-500/10",
              "hover:text-purple-700",
              "dark:text-purple-300 dark:hover:text-purple-200",
            )}
          >
            {isAiAnalysisPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : getAnalysis ? (
              <>
                <RefreshCw className="size-4" />
                Regenerate Analysis
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Analyze Quiz By AI
              </>
            )}
          </Button>
          <Badge variant="outline" className="gap-1 px-3 py-1 text-xs">
            <Clock className="size-3.5 text-muted-foreground" />
            {quiz.duration} mins
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 text-xs">
            <HelpCircle className="size-3.5 text-muted-foreground" />
            {quiz.questionCount} Questions
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 text-xs">
            <Award className="size-3.5 text-muted-foreground" />
            Pass: {quiz.passingScore}%
          </Badge>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.totalStudent}</div>
            <p className="text-xs text-muted-foreground">
              {analysis.totalAttempts} total submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {analysis.passRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.passedStudents} Passed / {analysis.failedStudents}{" "}
              Failed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Best Score
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.averageBestScore.toFixed(1)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / {quiz.totalMark} pts
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Latest avg: {analysis.averageLatestScore.toFixed(1)} pts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attempts</CardTitle>
            <RotateCcw className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.averageAttemptsPerStudent.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Max limit: {quiz.maxAttempts} attempts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-7">
        {isInstructorAnalysisLoading ? (
          <AiGeneratingSkeleton />
        ) : isInstructorAnalysisError ? null : getAnalysis ? (
          <QuizInstructorAiAnalysis
            analysisData={{
              analysis: getAnalysis.analysis,
              cached: true,
              data: {
                quizId: getAnalysis.metrics.quizId,
                title: getAnalysis.title,
                passingScore: getAnalysis.metrics.passingScore,
                totalStudents: getAnalysis.totalStudents,
                totalAttempts: getAnalysis.totalAttempts,
                passedStudents: getAnalysis.metrics.passedStudents,
                failedStudents: getAnalysis.metrics.failedStudents,
                passRate: getAnalysis.metrics.passRate,
                failRate: getAnalysis.metrics.failRate,
                averageBestScore: getAnalysis.metrics.averageBestScore,
                averageLatestScore: getAnalysis.metrics.averageLatestScore,
                averageAttemptsPerStudent:
                  getAnalysis.metrics.averageAttemptsPerStudent,
                students: getAnalysis.students,
                questionStats: getAnalysis.metrics.questionStats,
              },
            }}
            defaultOpen={true}
          />
        ) : null}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Question Performance Section */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="size-4 text-primary" />
              Question Analytics
            </CardTitle>
            <CardDescription>
              Performance stats calculated per question across all attempts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.questionStats.map((q, index) => (
              <div
                key={q.questionId}
                className="space-y-2 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Q{index + 1}. {q.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {q.studentsCount} Responses
                  </span>
                </div>

                {/* Multi-segment progress visualizer */}
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${q.correctRate}%` }}
                    title={`Correct: ${q.correctRate}%`}
                  />
                  <div
                    className="bg-rose-500 transition-all"
                    style={{ width: `${q.errorRate}%` }}
                    title={`Wrong: ${q.errorRate}%`}
                  />
                  <div
                    className="bg-amber-400 transition-all"
                    style={{ width: `${q.unansweredRate}%` }}
                    title={`Unanswered: ${q.unansweredRate}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Correct: {q.correct} ({q.correctRate.toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-rose-500" />
                      Wrong: {q.wrong} ({q.errorRate.toFixed(0)}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-400" />
                      Skipped: {q.unanswered} ({q.unansweredRate.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Results Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Student Attempts
            </CardTitle>
            <CardDescription>
              Individual score breakdown and attempt tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead className="text-center">Attempts</TableHead>
                  <TableHead className="text-right">Best Score</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px]">
                            {student.studentId.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{student.studentId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {student.attemptsCount} / {quiz.maxAttempts}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold">
                      {student.bestScore !== null
                        ? `${student.bestScore} pts`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {student.passed ? (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                        >
                          Passed
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400"
                        >
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuizDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Skeleton className="h-96 rounded-xl lg:col-span-4" />
        <Skeleton className="h-96 rounded-xl lg:col-span-3" />
      </div>
    </div>
  );
}
