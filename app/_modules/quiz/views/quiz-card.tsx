"use client";

import {
  CircleHelp,
  Award,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Target,
  Trash2,
  Eye,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Quiz } from "../entities/quiz";
import { useQuizDialog } from "../context/quiz-dialog-context";
import { useDeleteQuiz } from "../hooks/useDeleteQuiz";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { DropdownMenuLinkItem } from "../../../../components/ui/dropdown-menu";

interface QuizItemProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizItemProps) {
  const { openUpdateQuiz } = useQuizDialog();
  const { mutateAsync: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await deleteQuiz({ quizId: quiz.id, courseId: quiz.courseId });
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error) ?? "Failed to delete quiz");
    }
  };

  return (
    <article className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CircleHelp className="size-5 text-muted-foreground" />
            </div>

            <h4 className="truncate font-semibold">{quiz.title}</h4>

            <Badge variant="secondary">Quiz</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="size-4" />

              <span>
                Passing score:
                <strong className="ml-1 font-medium text-foreground">
                  {quiz.passingScore}%
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="size-4" />

              <span>
                Total mark:
                <strong className="ml-1 font-medium text-foreground">
                  {quiz.totalMark}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw className="size-4" />

              <span>
                Maximum attempts:
                <strong className="ml-1 font-medium text-foreground">
                  {quiz.maxAttempts}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 "
                aria-label="Quiz options"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="z-50 w-40">
            <DropdownMenuLinkItem
              href={`/instructor-dashboard/quizzes/${quiz.id}`}
            >
              {" "}
              <Eye className="mr-2 size-3.5" /> View{" "}
            </DropdownMenuLinkItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                openUpdateQuiz(quiz);
              }}
            >
              <Pencil className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
