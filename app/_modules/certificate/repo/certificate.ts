import { Certificate } from "../entities/certificate";
import { PublicCertificate } from "../entities/public-certificate";
import { UserCertificate } from "../entities/user-certificates";

export interface ICertificateAPI {
  createCertificate(courseId: string, studentId: string): Promise<Certificate>;

  getCourseCertificates(courseId: string): Promise<UserCertificate[]>;
  getUserCertificates(studentId: string): Promise<Certificate[]>;

  getMyCertificates(): Promise<UserCertificate[]>;

  getCertificateByNumber(
    courseId: string,
    certificateNumber: string,
  ): Promise<Certificate | null>;

  getStudentCertificates(
    courseId: string,
    studentId: string,
  ): Promise<Certificate[]>;

  getCertificateById(
    courseId: string,
    certificateId: string,
  ): Promise<Certificate>;

  deleteCertificate(
    courseId: string,
    certificateId: string,
  ): Promise<Certificate>;
  findById(id: string): Promise<UserCertificate>;
  findPublicByCertificateNum(
    certificateNumber: string,
  ): Promise<PublicCertificate>;
}
