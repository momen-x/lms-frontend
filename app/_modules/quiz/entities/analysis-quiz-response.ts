export interface AnalysisQuizResponse {
  quizId: string;
  title: string;
  passingScore: number;

  totalStudent: number;
  totalAttempts: number;

  passedStudents: number;
  failedStudents: number;

  passRate: number;

  failRate: number;

  averageBestScore: number;
  averageLatestScore: number;
  averageAttemptsPerStudent: number;

  students: {
    studentId: string;
    attemptsCount: number;
    bestScore: number | null;
    latestScore: number | null;
    passed: boolean;
  }[];
  questionStats: {
    correctRate: number;
    errorRate: number;
    unansweredRate: number;
    questionId: string;
    text: string;
    studentsCount: number;
    correct: number;
    wrong: number;
    unanswered: number;
  }[];
}
