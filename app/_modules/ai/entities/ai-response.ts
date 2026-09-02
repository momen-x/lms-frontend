export interface AskCourseOrLessonAssistantResponse {
  content: string;
  finishReason: string | null;
  sources: [
    {
      id: string;
      mediaId: string;
      content: string;
      chunkIndex: number;
      pageNumber: number;
      startTime: string | null;
      endTime: string | null;
      score: number;
    },
  ];
}

export interface GenerateResponse {
  content: string;
  finishReason: string | null;
  cached: boolean;
}

export interface StudentAnalysisPerformanceResponse {
  performance: StudentQuizPerformance;
  analysis: string;
  cached: boolean;
}

export interface InstructorAnalysisStudentsQuizPerformanceResponse {
  data: {
    quizId: string;
    title: string;
    passingScore: number;
    totalStudents: number;
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
      bestScore: number;
      latestScore: number;
      passed: boolean;
    }[];

    questionStats: {
      questionId: string;
      text: string;
      studentsCount: number;
      correct: number;
      wrong: number;
      unanswered: number;
      correctRate: number;
      errorRate: number;
      unansweredRate: number;
    }[];
  };
  analysis: string;
  cached: boolean;
}

export interface StudentStudyPlanResponse {
  context: {
    course: {
      id: string;
      title: string;
      progress: number;
      completed: false;
      enrolledAt: string;
    };
    learningPosition: {
      type: string;
      itemId: string;
    };
    lessons: {
      total: 10;
      completedCount: 5;
      remainingCount: 5;
      completed: [];
      remaining: [];
    };
    quizzes: [
      {
        quizId: string;
        title: string;
        passingScore: number;
        attemptsCount: number;
        bestScore: number | null;
        latestScore: number | null;
        passed: boolean;
        attempts: [];
        wrongQuestions: [];
        unansweredQuestions: [];
        status: string;
      },
    ];
  };
  plan: string;
  cached: boolean;
}
export interface AIMessageSource {
  id: string;
  mediaId: string;
  score: number;
  content: string;
  endTime: string | null;
  startTime: string | null;
  chunkIndex: number;
  pageNumber: number;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  sources: AIMessageSource[] | null;
  createdAt: string;
}

export type QuizAnalysisResponse = {
  id: string;
  quizId: string;
  fingerprint: string;
  title: string;
  analysis: string; // markdown-formatted report text
  createdAt: string; // ISO date string
  totalStudents: number;
  totalAttempts: number;
  metrics: QuizAnalysisMetrics;
  students: QuizAnalysisStudent[];
};

export type QuizAnalysisMetrics = {
  quizId: string;
  passingScore: number;
  passRate: number;
  failRate: number;
  passedStudents: number;
  failedStudents: number;
  averageBestScore: number;
  averageLatestScore: number;
  averageAttemptsPerStudent: number;
  questionStats: QuizAnalysisQuestionStat[];
};

export type QuizAnalysisQuestionStat = {
  questionId: string;
  text: string;
  studentsCount: number;
  correct: number;
  wrong: number;
  unanswered: number;
  correctRate: number;
  errorRate: number;
  unansweredRate: number;
};

export type QuizAnalysisStudent = {
  studentId: string;
  attemptsCount: number;
  bestScore: number;
  latestScore: number;
  passed: boolean;
};

export interface StudentQuizPerformanceAnalysisResponse {
  performance: StudentQuizPerformance;
  analysis: string;
  cached: boolean;
}

export interface StudentQuizPerformance {
  quizId: string;
  title: string;
  passingScore: number;

  attemptsCount: number;
  bestScore: number;
  latestScore: number;
  passed: boolean;

  attempts: StudentQuizAttempt[];

  wrongQuestions: WrongQuestion[];
  unansweredQuestions: UnansweredQuestion[];
}

export interface StudentQuizAttempt {
  id: string;
  attemptNumber: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: string;

  questions: StudentQuizAttemptQuestion[];
}

export interface StudentQuizAttemptQuestion {
  questionId: string;
  text: string;
  order: number;

  answer: StudentQuizAttemptAnswer | null;
}

export interface StudentQuizAttemptAnswer {
  choiceId: string;
  text: string;
  isCorrect: boolean;
}

export interface WrongQuestion {
  attemptId: string;
  attemptNumber: number;
  questionId: string;
  text: string;
  selectedAnswer: string;
}

export interface UnansweredQuestion {
  attemptId: string;
  attemptNumber: number;
  questionId: string;
  text: string;
}
