import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resCertificate } from "../repo/resCertificate";
import { certificateQueryKeys } from "./certificate-query-keys";

type CreateCertificateVariables = {
  courseId: string;
  studentId: string;
};

export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, studentId }: CreateCertificateVariables) =>
      resCertificate.createCertificate(courseId, studentId),

    onSuccess: (certificate) => {
      queryClient.setQueryData(
        certificateQueryKeys.detail(certificate.courseId!, certificate.id),
        certificate,
      );

      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.course(certificate.courseId!),
      });

      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.student(
          certificate.courseId!,
          certificate.studentId!,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.mine(),
      });
    },
  });
}
