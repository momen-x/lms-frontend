import { QuizDashboard } from "@/app/_modules/quiz/views/quiz-analysis";
import { TParams } from "@/types/params";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Dashboard",
};

const QuizInfoPage = async ({ params }: TParams) => {
  const { id } = await params;
  return (
    <div>
      <QuizDashboard quizId={id} />
    </div>
  );
};

export default QuizInfoPage;
