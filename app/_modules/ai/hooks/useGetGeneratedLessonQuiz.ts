import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetGeneratedLessonQuiz = (lessonId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.generatedLessonQuiz(lessonId),
    queryFn: () => resAi.getGeneratedLessonQuiz(lessonId),
    enabled: Boolean(lessonId),
  });
};
