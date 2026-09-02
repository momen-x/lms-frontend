import { useQuery } from "@tanstack/react-query";

import { resQuiz } from "../repo/resQuiz";
import { QUIZ_KEYS } from "./quiz-keys";

export function useGetStudentQuizAnalysis(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.studentAnalysis(quizId),
    queryFn: () => resQuiz.analysisStudentQuiz(quizId),
    enabled: Boolean(quizId),
  });
}
