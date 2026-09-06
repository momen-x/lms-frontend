export interface Certificate {
  id: string;
  studentId: string | null;
  courseId: string | null;
  certificateNumber: string;
  studentNameSnapshot: string;
  instructorNameSnapshot: string;
  courseTitleSnapshot: string;
  signature: string;
  signatureVersion: number;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
}


