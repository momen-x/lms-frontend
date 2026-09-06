/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import {
  Award,
  CalendarDays,
  Download,
  Hash,
  Printer,
  Share2,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import QueryErrorState from "@/components/sharing/query-error-state";

import { useGetCertificateById } from "../hooks/useGetCertificateById";
import transformingTheDateToATextString from "@/utils/from-date-to-string";

type CertificateDetailsProps = {
  certificateId: string;
};

export default function CertificateDetails({
  certificateId,
}: CertificateDetailsProps) {
  const {
    data: certificate,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetCertificateById(certificateId);

  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    setVerificationUrl(
      `${window.location.origin}/certificates/verify/${certificate?.certificateNumber}`,
    );
  }, [certificate?.certificateNumber]);

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isError) {
    return (
      <QueryErrorState
        title="Failed to load certificate"
        description="We couldn’t load this certificate."
        isRetrying={isFetching}
        onRetry={() => refetch()}
      />
    );
  }

  if (!certificate) {
    return <div>No certificate found</div>;
  }

  const issueDate = transformingTheDateToATextString(
    certificate.issueDate ?? certificate.createdAt,
  );


  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/certificates/verify/${certificate.certificateNumber}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${certificate.courseTitleSnapshot} Certificate`,
          text: `${certificate.studentNameSnapshot} completed ${certificate.courseTitleSnapshot}.`,
          url: publicUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(publicUrl);

      toast.success("Certificate link copied");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      toast.error("Unable to share certificate");
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-sm text-muted-foreground">
            Certificate of Completion
          </p>

          <h1 className="mt-1 text-xl font-semibold">
            {certificate.courseTitleSnapshot} -{" "}
            {certificate.studentNameSnapshot}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="size-4" />
            Share
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="size-4" />
            Print
          </Button>

          <Button type="button" onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div
        id="certificate-preview"
        className="relative overflow-hidden rounded-2xl bg-[#f8f5ed] p-3 text-[#191919] shadow-xl print:rounded-none print:shadow-none"
      >
        <div className="border-2 border-[#b89b5e] p-2">
          <div className="border border-[#b89b5e]/70 px-8 py-12 sm:px-12 lg:px-20 lg:py-16">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-[#b89b5e]">
                <Award className="size-8" />
              </div>

              <p className="mt-6 text-sm font-medium uppercase tracking-[0.35em] text-[#7b6740]">
                Certificate of Completion
              </p>

              <div className="mt-6 h-px w-24 bg-[#b89b5e]" />

              <p className="mt-8 text-sm text-[#6e6a61]">
                This certificate is proudly presented to
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {certificate.studentNameSnapshot ?? "Student"}
              </h2>

              <p className="mt-7 text-sm text-[#6e6a61]">
                for successfully completing all requirements of
              </p>

              <h3 className="mt-3 max-w-3xl text-2xl font-bold sm:text-3xl">
                {certificate.courseTitleSnapshot ?? "Course Title"}
              </h3>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#706b61]">
                This certificate recognizes the successful completion of the
                course requirements and achievement of the required learning
                outcomes.
              </p>

              <div className="mt-10 grid w-full gap-6 border-y border-[#b89b5e]/40 py-6 sm:grid-cols-3">
                <CertificateMeta
                  icon={<UserRound className="size-4" />}
                  label="Instructor"
                  value={certificate.instructorNameSnapshot ?? "LMS Instructor"}
                />

                <CertificateMeta
                  icon={<CalendarDays className="size-4" />}
                  label="Issued"
                  value={issueDate}
                />

                <CertificateMeta
                  icon={<Hash className="size-4" />}
                  label="Certificate No."
                  value={certificate.certificateNumber}
                />
              </div>

              <div className="mt-12 grid w-full gap-10 sm:grid-cols-2">
                <Signature
                  name={certificate.instructorNameSnapshot ?? "Instructor"}
                  label="Instructor"
                />

                <Signature name="LMS" label="Authorized by" />
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                {verificationUrl && (
                  <div className="rounded-lg border border-[#b89b5e]/50 bg-white p-2">
                    <QRCodeSVG value={verificationUrl} size={90} level="M" />
                  </div>
                )}

                <p className="max-w-xl text-xs leading-5 text-[#8a8478]">
                  Scan the QR code or verify this certificate using certificate
                  number{" "}
                  <span className="font-medium">
                    {certificate.certificateNumber}
                  </span>
                  .
                  <br />
                  This certificate is digitally signed and can be verified
                  without a handwritten signature.
                  <br />
                  Signature version: {certificate.signatureVersion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#84765b]">
        {icon}
        {label}
      </div>

      <p className="mt-2 max-w-full wrap-break-word text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function Signature({ name, label }: { name: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-medium">{name}</p>

      <div className="mx-auto mt-3 h-px max-w-48 bg-[#72684f]" />

      <p className="mt-2 text-xs text-[#7d776c]">{label}</p>
    </div>
  );
}
