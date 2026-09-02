import { CreateQuizData } from "../dto/create-quiz";
import { UpdateQuizData } from "../dto/update-quiz";
import { AnalysisQuizResponse } from "../entities/analysis-quiz-response";
import { AnalysisStudentPerformance } from "../entities/analysis-student-performance";
import { Quiz } from "../entities/quiz";

export interface IQuizAPI {
  create: (courseId: string, data: CreateQuizData) => Promise<Quiz>;
  getCourseQuizzes: (courseId: string) => Promise<Quiz[]>;
  getById: (quizId: string) => Promise<Quiz>;
  update: (quizId: string, data: UpdateQuizData) => Promise<Quiz>;
  delete: (quizId: string) => Promise<Quiz>;
  analysisStudentQuiz: (quizId: string) => Promise<AnalysisStudentPerformance>;
  //just for instructor
  analysisQuizPerformance: (quizId: string) => Promise<AnalysisQuizResponse>;
}
