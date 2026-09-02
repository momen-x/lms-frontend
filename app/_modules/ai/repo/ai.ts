import { askQuestionType } from "../dto/ask-question";
import {
  AIMessage,
  AskCourseOrLessonAssistantResponse,
  GenerateResponse,
  StudentQuizPerformanceAnalysisResponse,
  InstructorAnalysisStudentsQuizPerformanceResponse,
  QuizAnalysisResponse,
  StudentAnalysisPerformanceResponse,
  StudentStudyPlanResponse,
} from "../entities/ai-response";

export interface IAiAPI {
  askCourseAssistant: (
    courseId: string,
    dto: askQuestionType,
  ) => Promise<AskCourseOrLessonAssistantResponse>;
  askLessonAssistant: (
    lessonId: string,
    dto: askQuestionType,
  ) => Promise<AskCourseOrLessonAssistantResponse>;
  generateLessonSummary: (lessonId: string) => Promise<GenerateResponse>;
  generateQuizFromLesson: (lessonId: string) => Promise<GenerateResponse>;
  generateLessonsFromCourse: (courseId: string) => Promise<GenerateResponse>;
  generateQuizFromCourse: (courseId: string) => Promise<GenerateResponse>;
  analyzeStudentQuizPerformance: (
    quizId: string,
  ) => Promise<StudentAnalysisPerformanceResponse>;
  analyzeQuizForInstructor: (
    quizId: string,
  ) => Promise<InstructorAnalysisStudentsQuizPerformanceResponse>;
  generateStudentStudyPlan: (
    courseId: string,
  ) => Promise<StudentStudyPlanResponse>;
  //history methods
  getCourseAssistantHistory: (courseId: string) => Promise<AIMessage[]>;
  getLessonAssistantHistory: (lessonId: string) => Promise<AIMessage[]>;
  getGeneratedLessonSummary: (
    lessonId: string,
  ) => Promise<{ content: string } | null>;
  getGeneratedLessonQuiz: (
    lessonId: string,
  ) => Promise<{ content: string } | null>;
  getGeneratedCourseQuiz: (
    courseId: string,
  ) => Promise<{ content: string } | null>;
  getGeneratedLessonsFromCourse: (
    courseId: string,
  ) => Promise<{ content: string } | null>;
  getAnalyzeStudentQuizPerformance: (
    quizId: string,
  ) => Promise<StudentQuizPerformanceAnalysisResponse | null>;
  getGeneratedStudyPlan: (courseId: string) => Promise<{ plan: string } | null>;
  getInstructorQuizAnalysis: (
    quizId: string,
  ) => Promise<QuizAnalysisResponse | null>;
}
