export const AI_QUERY_KEYS = {
  all: ["ai"] as const,
  courseAssistantHistory: (courseId: string) =>
    [...AI_QUERY_KEYS.all, "course", courseId, "assistant-history"] as const,
  lessonAssistantHistory: (lessonId: string) =>
    [...AI_QUERY_KEYS.all, "lesson", lessonId, "assistant-history"] as const,
  generatedLessonSummary: (lessonId: string) =>
    [...AI_QUERY_KEYS.all, "lesson", lessonId, "generated-summary"] as const,
  generatedLessonQuiz: (lessonId: string) =>
    [...AI_QUERY_KEYS.all, "lesson", lessonId, "generated-quiz"] as const,
  generatedCourseQuiz: (courseId: string) =>
    [...AI_QUERY_KEYS.all, "course", courseId, "generated-quiz"] as const,
  generatedLessonsFromCourse: (courseId: string) =>
    [...AI_QUERY_KEYS.all, "course", courseId, "generated-lessons"] as const,
  studentQuizPerformance: (quizId: string) =>
    [...AI_QUERY_KEYS.all, "quiz", quizId, "student-performance"] as const,
  generatedStudyPlan: (courseId: string) =>
    [...AI_QUERY_KEYS.all, "course", courseId, "generated-study-plan"] as const,
  instructorQuizAnalysis: (quizId: string) =>
    [...AI_QUERY_KEYS.all, "quiz", quizId, "instructor-analysis"] as const,
};
