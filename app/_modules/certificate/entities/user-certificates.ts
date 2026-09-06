import { Certificate } from "./certificate";

export interface UserCertificate extends Certificate {
  course: {
    id: string;
    thumbnail: string;
    title: string;
    level: string;
    instructor: {
      avatar: string;
      email: string;
      id: string;
      name: string;
    };
  };
  student: { name: string; email: string; id: string; avatar: string };
}
