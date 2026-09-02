import { useQuery } from "@tanstack/react-query";

import { resAi } from "../repo/resAi";
import { AI_QUERY_KEYS } from "./ai-query-keys";

export const useGetAnalyzeStudentQuizPerformance = (quizId: string) => {
  return useQuery({
    queryKey: AI_QUERY_KEYS.studentQuizPerformance(quizId),
    queryFn: () => resAi.getAnalyzeStudentQuizPerformance(quizId),
    enabled: Boolean(quizId),
  });
};
