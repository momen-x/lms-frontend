export interface Quiz {
  id: string;
  courseId: string;
  questionBankId: string;
  questionCount: number;
  totalMark: number;
  duration: number;
  /** Passing percentage from 0 to 100. */
  passingScore: number;
  maxAttempts: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}
