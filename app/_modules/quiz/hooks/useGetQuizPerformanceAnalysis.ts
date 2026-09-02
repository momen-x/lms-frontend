import { useQuery } from "@tanstack/react-query";

import { resQuiz } from "../repo/resQuiz";
import { QUIZ_KEYS } from "./quiz-keys";

export function useGetQuizPerformanceAnalysis(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.analysis(quizId),
    queryFn: () => resQuiz.analysisQuizPerformance(quizId),
    enabled: Boolean(quizId),
  });
}
