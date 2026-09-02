import { useMutation, useQueryClient } from "@tanstack/react-query";

import { askQuestionType } from "../dto/ask-question";
import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

interface AskCourseAssistantVariables {
  courseId: string;
  dto: askQuestionType;
}

export const useAskCourseAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, dto }: AskCourseAssistantVariables) =>
      resAi.askCourseAssistant(courseId, dto),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: AI_QUERY_KEYS.courseAssistantHistory(variables.courseId),
      });
    },
  });
};
