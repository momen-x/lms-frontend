import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetGeneratedCourseQuiz = (courseId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.generatedCourseQuiz(courseId),
    queryFn: () => resAi.getGeneratedCourseQuiz(courseId),
    enabled: Boolean(courseId),
  });
};
