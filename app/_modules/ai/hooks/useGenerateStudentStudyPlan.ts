import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGenerateStudentStudyPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => resAi.generateStudentStudyPlan(courseId),
    onSuccess: (summary, courseId) => {
      queryClient.setQueryData(
        AI_QUERY_KEYS.generatedStudyPlan(courseId),
        summary,
      );
    },
  });
};
