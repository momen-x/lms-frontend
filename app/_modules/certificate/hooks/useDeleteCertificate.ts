import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resCertificate } from "../repo/resCertificate";
import { certificateQueryKeys } from "./certificate-query-keys";

type DeleteCertificateVariables = {
  courseId: string;
  certificateId: string;
};

export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, certificateId }: DeleteCertificateVariables) =>
      resCertificate.deleteCertificate(courseId, certificateId),

    onSuccess: (certificate) => {
      queryClient.removeQueries({
        queryKey: certificateQueryKeys.detail(
          certificate.courseId!,
          certificate.id,
        ),
      });

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
