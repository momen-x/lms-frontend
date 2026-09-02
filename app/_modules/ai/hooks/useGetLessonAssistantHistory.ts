import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetLessonAssistantHistory = (lessonId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.lessonAssistantHistory(lessonId),
    queryFn: () => resAi.getLessonAssistantHistory(lessonId),
    enabled: Boolean(lessonId),
  });
};
