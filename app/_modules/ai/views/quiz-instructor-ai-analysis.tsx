"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AiMarkdown } from "@/app/_modules/ai/views/ai-markdown";
import { cn } from "@/lib/utils";
import type { InstructorAnalysisStudentsQuizPerformanceResponse } from "@/app/_modules/ai/entities/ai-response";

interface QuizInstructorAiAnalysisProps {
  analysisData: InstructorAnalysisStudentsQuizPerformanceResponse;
  defaultOpen?: boolean;
}

export function QuizInstructorAiAnalysis({
  analysisData,
  defaultOpen = true,
}: QuizInstructorAiAnalysisProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { data, analysis } = analysisData;
  console.log("data is ", data);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
    >
      {/* 1. Header with Collapsible Trigger */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-lg tracking-tight">
              AI Student Analytics
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {/* {data.title} */}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {/* {data.totalStudents} Students */}
          </Badge>

          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground hover:bg-accent"
                aria-label="Toggle analysis content"
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

      {/* 2. Collapsible Content Body */}
      <CollapsibleContent className="mt-6 space-y-6 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {/* Executive Insights */}
        <Card className="border-purple-200/80 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-purple-950 dark:text-purple-300">
              <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
              AI Executive Insights
            </CardTitle>
            <CardDescription>
              Automated analysis and action items generated for this quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiMarkdown content={analysis} />
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{data.totalStudents}</div> */}
              <p className="text-xs text-muted-foreground">
                {/* {data.totalAttempts} total attempts */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {/* {data.passRate.toFixed(1)}% */}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* {data.passedStudents} Passed / {data.failedStudents} Failed */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Best Score
              </CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {data.averageBestScore.toFixed(1)} */}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Latest avg: {data.averageLatestScore.toFixed(1)} */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Attempts/Student
              </CardTitle>
              <RotateCcw className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {data.averageAttemptsPerStudent.toFixed(1)} */}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Passing threshold: {data.passingScore}% */}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Question Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 className="size-4 text-primary" />
              Question Breakdown
            </CardTitle>
            <CardDescription>
              Performance stats per question across all submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.questionStats.map((q, index) => (
              <div
                key={q.questionId}
                className="space-y-2 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="font-medium">
                    Q{index + 1}. {q.text}
                  </span>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {q.studentsCount} Answers
                  </Badge>
                </div>

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
                    title={`Skipped: ${q.unansweredRate}%`}
                  />
                </div>

                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
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
            ))}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
