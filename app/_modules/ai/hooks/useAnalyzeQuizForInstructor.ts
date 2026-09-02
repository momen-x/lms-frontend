import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useAnalyzeQuizForInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: string) => resAi.analyzeQuizForInstructor(quizId),
    onSuccess: (summary, quizId) => {
      queryClient.setQueryData(
        AI_QUERY_KEYS.instructorQuizAnalysis(quizId),
        summary,
      );
    },
  });
};
