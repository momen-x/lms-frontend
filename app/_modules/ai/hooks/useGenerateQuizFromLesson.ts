import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGenerateQuizFromLesson = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => resAi.generateQuizFromLesson(lessonId),
    onSuccess: (summary, lessonId) => {
      queryClient.setQueryData(
        AI_QUERY_KEYS.generatedLessonQuiz(lessonId),
        summary,
      );
    },
  });
};
