"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
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
import type { StudentAnalysisPerformanceResponse } from "@/app/_modules/ai/entities/ai-response";

interface StudentQuizAiAnalysisProps {
  data: StudentAnalysisPerformanceResponse;
  defaultOpen?: boolean;
}

export function StudentQuizAiAnalysis({
  data,
  defaultOpen = true,
}: StudentQuizAiAnalysisProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { performance, analysis } = data;

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
              AI Personal Performance Review
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {performance.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={performance.passed ? "secondary" : "destructive"}
            className="hidden sm:inline-flex"
          >
            {performance.passed ? "Passed" : "Failed"} ({performance.bestScore}
            %)
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
        {/* Personalized Recommendations */}
        <Card className="border-purple-200/80 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-purple-950 dark:text-purple-300">
              <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
              AI Study Recommendation
            </CardTitle>
            <CardDescription>
              Personalized insights based on your quiz results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiMarkdown content={analysis} />
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {performance.passed ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <XCircle className="size-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {performance.passed ? "Passed" : "Failed"}
                </span>
                <Badge
                  variant={performance.passed ? "secondary" : "destructive"}
                >
                  Pass: {performance.passingScore}%
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Required score threshold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {performance.bestScore}%
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest score: {performance.latestScore}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Attempts Used
              </CardTitle>
              <RotateCcw className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performance.attemptsCount}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Total submitted attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
              <AlertTriangle className="size-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {performance.wrongQuestions.length}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Wrong questions flagged
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Questions Breakdown Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Incorrect Answers */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rose-600 dark:text-rose-400">
                <XCircle className="size-4" />
                Incorrect Answers ({performance.wrongQuestions.length})
              </CardTitle>
              <CardDescription>
                Review questions you answered wrong
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {performance.wrongQuestions &&
              performance.wrongQuestions.length < 1 ? (
                <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                  No wrong answers! Great job! 🎉
                </div>
              ) : (
                performance.wrongQuestions.map((q, idx) => (
                  <div
                    key={`${q.questionId}-${idx}`}
                    className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-950/50 dark:bg-rose-950/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{q.text}</p>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        Attempt #{q.attemptNumber}
                      </Badge>
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      Your choice:{" "}
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {q.selectedAnswer}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Unanswered Questions */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-amber-600 dark:text-amber-400">
                <HelpCircle className="size-4" />
                Unanswered Questions ({performance.unansweredQuestions.length})
              </CardTitle>
              <CardDescription>
                Questions skipped during attempts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {performance.unansweredQuestions.length < 1 ? (
                <div className="flex h-28 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                  No skipped questions.
                </div>
              ) : (
                performance.unansweredQuestions.map((q, idx) => (
                  <div
                    key={`${q.questionId}-${idx}`}
                    className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs dark:border-amber-950/50 dark:bg-amber-950/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{q.text}</p>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        Attempt #{q.attemptNumber}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
