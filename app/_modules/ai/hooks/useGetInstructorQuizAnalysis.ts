import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetInstructorQuizAnalysis = (quizId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.instructorQuizAnalysis(quizId),
    queryFn: () => resAi.getInstructorQuizAnalysis(quizId),
    enabled: Boolean(quizId),
  });
};
