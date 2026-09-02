export const QUIZ_KEYS = {
  all: ["quizzes"] as const,

  detail: (quizId: string) => [...QUIZ_KEYS.all, "detail", quizId] as const,

  analysis: (quizId: string) =>
    [...QUIZ_KEYS.all, "analysis", quizId] as const,

  studentAnalysis: (quizId: string) =>
    [...QUIZ_KEYS.all, "student-analysis", quizId] as const,

  course: (courseId: string) => [...QUIZ_KEYS.all, "course", courseId] as const,
};
