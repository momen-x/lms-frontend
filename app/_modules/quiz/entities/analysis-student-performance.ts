export interface AnalysisStudentPerformance {
  quizId: string;
  title: string;
  passingScore: number;
  attemptsCount: number;
  bestScore: number | null;
  latestScore: number | null;
  passed: boolean;
  attempts: {
    id: string;
    attemptNumber: number;
    score: number | null;
    correctAnswers: number | null;
    totalQuestions: number | null;
    submittedAt: Date | null;
    questions: {
      questionId: string;
      text: string;
      order: number;
      answer: {
        choiceId: string;
        text: string;
        isCorrect: boolean;
      } | null;
    }[];
  }[];
  wrongQuestions: {
    attemptId: string;
    attemptNumber: number;
    questionId: string;
    text: string;
    selectedAnswer: string;
  }[];
  unansweredQuestions: {
    attemptId: string;
    attemptNumber: number;
    questionId: string;
    text: string;
  }[][];
}
