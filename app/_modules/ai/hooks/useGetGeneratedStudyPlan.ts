import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetGeneratedStudyPlan = (courseId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.generatedStudyPlan(courseId),
    queryFn: () => resAi.getGeneratedStudyPlan(courseId),
    enabled: Boolean(courseId),
  });
};
