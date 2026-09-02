import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetCourseAssistantHistory = (courseId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.courseAssistantHistory(courseId),
    queryFn: () => resAi.getCourseAssistantHistory(courseId),
    enabled: Boolean(courseId),
  });
};
