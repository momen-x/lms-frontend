"use client";

import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateQuizData } from "../dto/create-quiz";
import { Quiz } from "../entities/quiz";
import { useUpdateQuiz } from "../hooks/useUpdateQuiz";

import QuizForm from "./quiz-form";
import { getErrorMessage } from "@/utils/get-axios-error-message";

interface UpdateQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
}

export default function UpdateQuiz({
  open,
  onOpenChange,
  quiz,
}: UpdateQuizProps) {
  const { mutateAsync: updateQuiz, isPending } = useUpdateQuiz();

  const handleSubmit = async (data: CreateQuizData) => {
    if (!quiz) {
      return;
    }

    try {
      await updateQuiz({
        quizId: quiz.id,
        courseId: quiz.courseId,
        data,
      });

      toast.success("Quiz updated successfully");
      onOpenChange(false);
    } catch (error) {
      const errMessage = getErrorMessage(error);
      toast.error(errMessage ?? "Failed to update quiz");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update quiz</DialogTitle>

          <DialogDescription>
            Update the quiz settings, total mark, and passing percentage.
          </DialogDescription>
        </DialogHeader>

        {quiz && (
          <QuizForm
            key={quiz.id}
            courseId={quiz.courseId}
            defaultValues={{
              title: quiz.title,
              passingScore: quiz.passingScore,
              maxAttempts: quiz.maxAttempts,
              duration: quiz.duration,
              questionCount: quiz.questionCount,
              totalMark: quiz.totalMark,
              questionBankId: quiz.questionBankId,
            }}
            submitLabel="Update quiz"
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
