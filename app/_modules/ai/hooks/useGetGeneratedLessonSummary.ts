import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetGeneratedLessonSummary = (lessonId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.generatedLessonSummary(lessonId),
    queryFn: () => resAi.getGeneratedLessonSummary(lessonId),
    enabled: Boolean(lessonId),
  });
};
