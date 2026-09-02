import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useAnalyzeStudentQuizPerformance = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) =>
      resAi.analyzeStudentQuizPerformance(quizId),
    onSuccess: (summary, quizId) => {
      queryClient.setQueryData(
        AI_QUERY_KEYS.studentQuizPerformance(quizId),
        summary,
      );
    },
  });
};
