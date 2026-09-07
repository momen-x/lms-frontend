import { Metadata } from "next";

import { ChoiceDialogProvider } from "@/app/_modules/choice/context/choice-dialog-context";
import { QuestionDialogProvider } from "@/app/_modules/question/context/question-dialog-context";
import QuestionBankQuestions from "@/app/_modules/question/views/question-bank-questions";

export const metadata: Metadata = {
  title: "Question bank questions",
  description: "Manage questions and choices for a question bank",
};

interface QuestionBankQuestionsPageProps {
  params: Promise<{ id: string; questionBankId: string }>;
}

export default async function QuestionBankQuestionsPage({
  params,
}: QuestionBankQuestionsPageProps) {
  const { questionBankId, id } = await params;

  return (
    <QuestionDialogProvider>
      <ChoiceDialogProvider>
        <QuestionBankQuestions questionBankId={questionBankId} courseId={id} />
      </ChoiceDialogProvider>
    </QuestionDialogProvider>
  );
}
