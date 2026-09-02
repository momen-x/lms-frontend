import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetGeneratedLessonsFromCourse = (courseId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.generatedLessonsFromCourse(courseId),
    queryFn: () => resAi.getGeneratedLessonsFromCourse(courseId),
    enabled: Boolean(courseId),
  });
};
