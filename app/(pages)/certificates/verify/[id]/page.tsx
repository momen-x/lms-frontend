import { Metadata } from "next";

import { TParams } from "@/types/params";
import PublicCertificateVerification from "@/app/_modules/certificate/views/public-certificate-verification";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify an LMS certificate",
};

const CertificateVerificationPage = async ({
  params,
}: TParams) => {
  const { id: certificateNumber } = await params;

  return (
    <PublicCertificateVerification
      certificateNumber={certificateNumber}
    />
  );
};

export default CertificateVerificationPage;