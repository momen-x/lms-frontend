import { api } from "@/utils/axiosInstance";

import { CreateQuestionsBankData } from "../dto/questions-bank.dto";
import { QuestionsBank, ResQuestionsBank } from "../entity/question-bank";
import { IQuestionsBankAPI } from "../repo/questionBank";

const BASE_URL = "/api/question-banks";

export const resQuestionBank: IQuestionsBankAPI = {
  create: async function (
    courseId: string,
    data: CreateQuestionsBankData,
  ): Promise<QuestionsBank> {
    const res = await api.post(`/api/courses/${courseId}/question-banks`, data);
    return res.data;
  },
  getCourseQuestionsBank: async function (
    courseId: string,
  ): Promise<ResQuestionsBank[]> {
    const res = await api.get<
      { questionBank: QuestionsBank; questionCount: number }[]
    >(`/api/courses/${courseId}/question-banks`);
    return res.data.map((item) => ({
      questionsBank: item.questionBank,
      questionCount: item.questionCount,
    }));
  },
  getById: async function (questionsBankId: string): Promise<QuestionsBank> {
    const res = await api.get(`${BASE_URL}/${questionsBankId}`);
    return res.data;
  },
  update: async function (
    questionsBankId: string,
    data: CreateQuestionsBankData,
  ): Promise<QuestionsBank> {
    const res = await api.patch(`${BASE_URL}/${questionsBankId}`, data);
    return res.data;
  },
  delete: async function (questionsBankId: string): Promise<QuestionsBank> {
    const res = await api.delete(`${BASE_URL}/${questionsBankId}`);
    return res.data;
  },
};
