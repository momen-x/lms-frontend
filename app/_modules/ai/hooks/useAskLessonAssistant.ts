import { useMutation, useQueryClient } from "@tanstack/react-query";

import { askQuestionType } from "../dto/ask-question";
import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

interface AskLessonAssistantVariables {
  lessonId: string;
  dto: askQuestionType;
}

export const useAskLessonAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, dto }: AskLessonAssistantVariables) =>
      resAi.askLessonAssistant(lessonId, dto),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: AI_QUERY_KEYS.lessonAssistantHistory(variables.lessonId),
      });
    },
  });
};
