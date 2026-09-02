import { api } from "@/utils/axiosInstance";
import { askQuestionType } from "../dto/ask-question";
import {
  AskCourseOrLessonAssistantResponse,
  GenerateResponse,
  StudentAnalysisPerformanceResponse,
  InstructorAnalysisStudentsQuizPerformanceResponse,
  StudentStudyPlanResponse,
  AIMessage,
  StudentQuizPerformanceAnalysisResponse,
  QuizAnalysisResponse,
} from "../entities/ai-response";
import { IAiAPI } from "./ai";

export const resAi: IAiAPI = {
  /**
   * @param courseId
   * @param dto
   * @access private student auth and enroll in course
   * @returns AskCourseOrLessonAssistantResponse
   */
  askCourseAssistant: async function (
    courseId: string,
    dto: askQuestionType,
  ): Promise<AskCourseOrLessonAssistantResponse> {
    const res = await api.post<AskCourseOrLessonAssistantResponse>(
      `/api/courses/${courseId}/ai/ask`,
      dto,
    );
    return res.data;
  },
  /**
   * @param lessonId
   * @param dto
   * @access private user auth and enroll in the course (lesson part of the course)
   * @returns AskCourseOrLessonAssistantResponse
   */
  askLessonAssistant: async function (
    lessonId: string,
    dto: askQuestionType,
  ): Promise<AskCourseOrLessonAssistantResponse> {
    const res = await api.post<AskCourseOrLessonAssistantResponse>(
      `/api/lessons/${lessonId}/ai/ask`,
      dto,
    );
    return res.data;
  },
  /**
   * @param lessonId
   * @access private  user auth and enroll in the course (lesson part of the course)
   * @returns GenerateResponse
   */
  generateLessonSummary: async function (
    lessonId: string,
  ): Promise<GenerateResponse> {
    const res = await api.post<GenerateResponse>(
      `/api/lessons/${lessonId}/ai/summary`,
    );
    return res.data;
  },
  /**
   * @param lessonId
   * @access  private instructor owner the course
   * @returns GenerateResponse
   */
  generateQuizFromLesson: async function (
    lessonId: string,
  ): Promise<GenerateResponse> {
    const res = await api.post<GenerateResponse>(
      `/api/lessons/${lessonId}/ai/quiz/generate`,
    );
    return res.data;
  },
  /**
   * @param courseId
   * @access  private instructor owner the course
   * @returns GenerateResponse
   */
  generateLessonsFromCourse: async function (
    courseId: string,
  ): Promise<GenerateResponse> {
    const res = await api.post<GenerateResponse>(
      `/api/courses/${courseId}/ai/lessons/generate`,
    );
    return res.data;
  },
  /**
   * @param courseId
   * @access  private instructor owner the course
   * @returns GenerateResponse
   */
  generateQuizFromCourse: async function (
    courseId: string,
  ): Promise<GenerateResponse> {
    const res = await api.post<GenerateResponse>(
      `/api/courses/${courseId}/ai/quiz/generate`,
    );
    return res.data;
  },
  /**
   * @param quizId
   * @access private all user can access to have quizzes and make the AI analysis it
   * @returns StudentAnalysisPerformanceResponse
   */
  analyzeStudentQuizPerformance: async function (
    quizId: string,
  ): Promise<StudentAnalysisPerformanceResponse> {
    const res = await api.post<StudentAnalysisPerformanceResponse>(
      `/api/quizzes/${quizId}/ai/performance`,
    );
    return res.data;
  },
  /**
   * @param quizId
   * @access  private instructor owner the course
   * @returns InstructorAnalysisStudentsQuizPerformanceResponse
   */
  analyzeQuizForInstructor: async function (
    quizId: string,
  ): Promise<InstructorAnalysisStudentsQuizPerformanceResponse> {
    const res =
      await api.post<InstructorAnalysisStudentsQuizPerformanceResponse>(
        `/api/quizzes/${quizId}/ai/instructor-analysis`,
      );
    return res.data;
  },
  /**
   * @param courseId
   * @access private user auth and enroll in the course
   * @returns StudentStudyPlanResponse
   */
  generateStudentStudyPlan: async function (
    courseId: string,
  ): Promise<StudentStudyPlanResponse> {
    const res = await api.post<StudentStudyPlanResponse>(
      `/api/courses/${courseId}/ai/study-plan`,
    );
    return res.data;
  },
  //Get methods

  /**
   * Gets the saved course assistant conversation.
   *
   * @param courseId
   * @access Private; authenticated student enrolled in the course
   * @returns AIMessage[]
   */
  getCourseAssistantHistory: async function (
    courseId: string,
  ): Promise<AIMessage[]> {
    const res = await api.get<AIMessage[]>(
      `/api/courses/${courseId}/ai/history`,
    );
    return res.data;
  },
  /**
   * Gets the saved lesson assistant conversation.
   *
   * @param lessonId
   * @access Private; authenticated student enrolled in the lesson's course
   * @returns AIMessage[]
   */
  getLessonAssistantHistory: async function (
    lessonId: string,
  ): Promise<AIMessage[]> {
    const res = await api.get<AIMessage[]>(
      `/api/lessons/${lessonId}/ai/history`,
    );
    return res.data;
  },
  /**
   * Gets the previously generated lesson summary.
   *
   * @param lessonId
   * @access Private; authenticated student enrolled in the lesson's course
   * @returns Generated summary content
   */
  getGeneratedLessonSummary: async function (
    lessonId: string,
  ): Promise<{ content: string } | null> {
    const res = await api.get<{ content: string } | null>(
      `/api/lessons/${lessonId}/ai/summary/generated`,
    );
    return res.data;
  },
  /**
   * Gets the quiz previously generated from a lesson.
   *
   * @param lessonId
   * @access Private; instructor who owns the course
   * @returns Generated quiz content
   */
  getGeneratedLessonQuiz: async function (
    lessonId: string,
  ): Promise<{ content: string } | null> {
    const res = await api.get<{ content: string }>(
      `/api/lessons/${lessonId}/ai/quiz/generated`,
    );
    return res.data;
  },
  /**
   * Gets the quiz previously generated from a course.
   *
   * @param courseId
   * @access Private; instructor who owns the course
   * @returns Generated quiz content
   */
  getGeneratedCourseQuiz: async function (
    courseId: string,
  ): Promise<{ content: string } | null> {
    const res = await api.get<{ content: string } | null>(
      `/api/courses/${courseId}/ai/quiz/generated`,
    );
    return res.data;
  },
  /**
   * Gets the lessons previously generated from a course.
   *
   * @param courseId
   * @access Private; instructor who owns the course
   * @returns Generated lessons content
   */
  getGeneratedLessonsFromCourse: async function (
    courseId: string,
  ): Promise<{ content: string } | null> {
    const res = await api.get<{ content: string } | null>(
      `/api/courses/${courseId}/ai/lessons/generated`,
    );
    return res.data;
  },
  /**
   * Gets a student's saved AI quiz-performance analysis.
   *
   * @param quizId
   * @access Private; authenticated student with access to the quiz
   * @returns GetStudentQuizPerformance
   */
  getAnalyzeStudentQuizPerformance: async function (
    quizId: string,
  ): Promise<StudentQuizPerformanceAnalysisResponse | null> {
    const res = await api.get<StudentQuizPerformanceAnalysisResponse | null>(
      `/api/quiz-performance/${quizId}`,
    );
    return res.data;
  },
  /**
   * Gets the previously generated study plan for a course.
   *
   * @param courseId
   * @access Private; authenticated student enrolled in the course
   * @returns Generated study-plan content
   */
  getGeneratedStudyPlan: async function (
    courseId: string,
  ): Promise<{ plan: string } | null> {
    const res = await api.get<{ plan: string } | null>(
      `/api/courses/${courseId}/ai/study-plan/generated`,
    );
    return res.data;
  },
  /**
   * Gets the saved instructor analysis for a quiz.
   *
   * @param quizId
   * @access Private; instructor who owns the course
   * @returns QuizAnalysisResponse
   */
  getInstructorQuizAnalysis: async function (
    quizId: string,
  ): Promise<QuizAnalysisResponse | null> {
    const res = await api.get<QuizAnalysisResponse | null>(
      `/api/quizzes/${quizId}/ai/instructor-analysis`,
    );
    return res.data;
  },
};
