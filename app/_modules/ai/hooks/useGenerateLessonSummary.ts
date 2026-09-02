import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGenerateLessonSummary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => resAi.generateLessonSummary(lessonId),
    onSuccess: (summary, lessonId) => {
      queryClient.setQueryData(
        AI_QUERY_KEYS.generatedLessonSummary(lessonId),
        summary,
      );
    },
  });
};
