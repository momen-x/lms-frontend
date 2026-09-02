import { api } from "@/utils/axiosInstance";
import { CreateQuizData } from "../dto/create-quiz";
import { UpdateQuizData } from "../dto/update-quiz";
import { Quiz } from "../entities/quiz";
import { IQuizAPI } from "./quiz";
import { AnalysisQuizResponse } from "../entities/analysis-quiz-response";
import { AnalysisStudentPerformance } from "../entities/analysis-student-performance";

const BASE_URL = "/api/quizzes";

export const resQuiz: IQuizAPI = {
  create: async function (
    courseId: string,
    data: CreateQuizData,
  ): Promise<Quiz> {
    const response = await api.post<Quiz>(
      `/api/courses/${courseId}/quizzes`,
      data,
    );

    return response.data;
  },
  getCourseQuizzes: async function (courseId: string): Promise<Quiz[]> {
    const response = await api.get<Quiz[]>(`/api/courses/${courseId}/quizzes`);

    return response.data;
  },

  getById: async function (quizId: string): Promise<Quiz> {
    const response = await api.get<Quiz>(`${BASE_URL}/${quizId}`);

    return response.data;
  },

  update: async function (quizId: string, data: UpdateQuizData): Promise<Quiz> {
    const response = await api.patch<Quiz>(`${BASE_URL}/${quizId}`, data);

    return response.data;
  },

  delete: async function (quizId: string): Promise<Quiz> {
    const response = await api.delete<Quiz>(`${BASE_URL}/${quizId}`);

    return response.data;
  },
  analysisQuizPerformance: async function (
    quizId: string,
  ): Promise<AnalysisQuizResponse> {
    const response = await api.get<AnalysisQuizResponse>(
      `${BASE_URL}/${quizId}/analysis`,
    );

    return response.data;
  },
  analysisStudentQuiz: async function (
    quizId: string,
  ): Promise<AnalysisStudentPerformance> {
    const response = await api.get<AnalysisStudentPerformance>(
      `${BASE_URL}/${quizId}/student-performance`,
    );

    return response.data;
  },
};
